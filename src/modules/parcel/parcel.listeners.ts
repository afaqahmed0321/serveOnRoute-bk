
import { Inject, forwardRef } from "@nestjs/common";
import { EventEmitter2,OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications/notifications.service";
import { RoutesService } from "../routes/routes.service";
import { UsersService } from "../users/users.service";
import { NOTIFICATION_TYPE } from "@/enums/notification.enum";
import { Parcel } from "./schemas/parcel.schema";
import { ParcelService } from "./parcel.service";
import { PaymentService } from "../payment/payment.service";


export class EventListener{
    constructor(
        @Inject(NotificationsService) private readonly notificationService:NotificationsService,
        @Inject(RoutesService) private readonly routesService:RoutesService,
        @Inject(UsersService) private readonly usersService:UsersService,
        @Inject(ParcelService) private readonly parcelService:ParcelService,
        @Inject(forwardRef(()=> PaymentService)) private readonly paymentService:PaymentService,

        ){}

        @OnEvent('reboot-bidding')
        async rebootBidding(parcel:Parcel){
        try{
                console.log("EVENT EMITTER PARCEL >>>>>",parcel);

            let body = {title:'Parcel Cancelled By Driver, Procedure Reboot!',body:`Parcel with Id: ${parcel._id} has been cancelled by driver and procedure again started`}
            await this.notificationService.sendNotification({user:parcel.customer_id,title:body.title,body:body.body,type:NOTIFICATION_TYPE.PARCEL_REBOOT})
        
                    // -----------GET PARCEL NEARBY RIDERS-------------
        let riders = await this.routesService.getNearbyRoutes({from_location:parcel.from_location_cor,to_location:parcel.to_location_cor,maxDistance:1000})
        let tokensInfo = await this.notificationService.getMultipleTokens(riders as string[])
        let notificationsTokens = tokensInfo.map(token=>token.notification_token)   // NOTIFICATION TOKENS OF NEARBY RIDERS
        let riderNotification = {title:'Parcel Created in Nearby',body:`Parcel with Id: ${parcel._id} has been created near you, If Intersted, >>> Please start Bidding <<<`,type:NOTIFICATION_TYPE.PARCEL_NOTIFY}
        let ridersNotifications = tokensInfo.map(token=>{return {...riderNotification,user:token.user}})
        await this.notificationService.create(ridersNotifications)
        await this.notificationService.sendMutipleDevicesNotification(riderNotification,notificationsTokens)
        console.log('---Parcel-Reboot-Successfully---')
        }catch(err){
            console.log('---Parcel-Reboot-Failed---\n',err)
        }

    }

    @OnEvent('upfront-payment')
    async upfrontPayment(parcel:Parcel){
    try{
        let parcelDetails:any = await this.parcelService.findOne(parcel._id as unknown as string)
        let customerPaymentMethod = await this.paymentService.findCriteria({user:parcelDetails?.customer_id._id})
        let paymentParam = {
            paymentMethod:customerPaymentMethod?.payment_method as string,
            customerId:parcelDetails.customer_id?.customerId as string,
            currency:"cad",
            parcel:parcel._id as unknown as string,
            amount:parcelDetails.pay_amount,
            rider_account:parcelDetails.rider_id.account
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>...",paymentParam);
        let payment = await this.paymentService.transferPayment(paymentParam);
        console.log('---Payment-Transfered-Successfully---',payment)
    }catch(err){
        console.log('---Payment-Transfered-Failed---',err)

    }

    }

    @OnEvent('parcel-refund-payment')
    async parcelRefundPayment(parcel:Parcel){
        try{
            let refundParam = {
            paymentIntentId:parcel.payment_intent as string,
            amount:parseFloat(parcel.pay_amount) - parseFloat(parcel.pay_amount)*0.1,
            refundApplicationFee:true,
            reverseTransfer: true
        }
        let refund = await this.paymentService.refundPayment(refundParam)
        console.log('---Payment-Refund-Successfully---',refund)
    }catch(err){
        console.log('---Payment-Refund-Failed---',err)
    }
    }
}