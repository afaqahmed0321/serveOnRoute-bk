import { ApiProperty } from "@nestjs/swagger"

export interface Proofs {

    
    customer_proof_description: string,
    
    customer_proof_images: [],
    
    rider_proof_images:[],
    
    rider_proof_description:string
}