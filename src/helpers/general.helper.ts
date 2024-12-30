import {Transform} from 'class-transformer'

export function generateRandom(len: number) {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
}

export function ToBoolean(): (target: any, key: string) => void {
  return  Transform((value: any) => value === 'true' || value === true || value === 1 || value === '1');
}

export const general_token = (refresh_token: any, res: any) => {
  console.log(process.env.COOKIE_HTTP_ONLY)
  res.cookie('refresh-token', refresh_token, {
    expires: new Date(new Date().getTime() + 60 * 1000 * 60 * 2),
    httpOnly: process.env.COOKIE_HTTP_ONLY,
    sameSite: process.env.COOKIE_SAME_SITE,
    secure: process.env.COOKIE_SECURE,
  });
};

export const getDateLastThirtyDayAgo = () => {
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() - 120));
  return priorDate
}

export const getRequiredDate = (days: number) => {
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() - days));
  return priorDate
}


export const getCurrentDate = () => {
  const today = new Date();
  return today
}

export const getDateDifference = (dateFrom: any, dateTo: any) => {
    const date1: any = new Date(dateFrom);
    const date2: any = new Date(dateTo);
    const diffTime: any = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays
}

export const getMonthName = (monthNumber: any) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'long' });
}

export const languagesData = () => {
  return [
  { value: 'Abkhazian', label: 'Abkhazian' },
  { value: 'Afar', label: 'Afar' },
  { value: 'Afrikaans', label: 'Afrikaans' },
  { value: 'Akan', label: 'Akan' },
  { value: 'Albanian', label: 'Albanian' },
  { value: 'Amharic', label: 'Amharic' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Aragonese', label: 'Aragonese' },
  { value: 'Armenian', label: 'Armenian' },
  { value: 'Assamese', label: 'Assamese' },
  { value: 'Avaric', label: 'Avaric' },
  { value: 'Avestan', label: 'Avestan' },
  { value: 'Aymara', label: 'Aymara' },
  { value: 'Azerbaijani', label: 'Azerbaijani' },
  { value: 'Bambara', label: 'Bambara' },
  { value: 'Bashkir', label: 'Bashkir' },
  { value: 'Basque', label: 'Basque' },
  { value: 'Belarusian', label: 'Belarusian' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Bihari', label: 'Bihari languages' },
  { value: 'Bislama', label: 'Bislama' },
  { value: 'Bosnian', label: 'Bosnian' },
  { value: 'Breton', label: 'Breton' },
  { value: 'Bulgarian', label: 'Bulgarian' },
  { value: 'Burmese', label: 'Burmese' },
  { value: 'Catalan', label: 'Catalan, Valencian' },
  { value: 'Central', label: 'Central Khmer' },
  { value: 'Chamorro', label: 'Chamorro' },
  { value: 'Chechen', label: 'Chechen' },
  { value: 'Chichewa', label: 'Chichewa, Chewa, Nyanja' },
  { value: 'Chinese', label: 'Chinese' },
  {
    value: 'Church',
    label: 'Church Slavonic, Old Bulgarian, Old Church Slavonic'
  },
  { value: 'Chuvash', label: 'Chuvash' },
  { value: 'Cornish', label: 'Cornish' },
  { value: 'Corsican', label: 'Corsican' },
  { value: 'Cree', label: 'Cree' },
  { value: 'Croatian', label: 'Croatian' },
  { value: 'Czech', label: 'Czech' },
  { value: 'Danish', label: 'Danish' },
  { value: 'Divehi', label: 'Divehi, Dhivehi, Maldivian' },
  { value: 'Dutch', label: 'Dutch, Flemish' },
  { value: 'Dzongkha', label: 'Dzongkha' },
  { value: 'English', label: 'English' },
  { value: 'Esperanto', label: 'Esperanto' },
  { value: 'Estonian', label: 'Estonian' },
  { value: 'Ewe', label: 'Ewe' },
  { value: 'Faroese', label: 'Faroese' },
  { value: 'Fijian', label: 'Fijian' },
  { value: 'Finnish', label: 'Finnish' },
  { value: 'French', label: 'French' },
  { value: 'Fulah', label: 'Fulah' },
  { value: 'Gaelic', label: 'Gaelic, Scottish Gaelic' },
  { value: 'Galician', label: 'Galician' },
  { value: 'Ganda', label: 'Ganda' },
  { value: 'Georgian', label: 'Georgian' },
  { value: 'German', label: 'German' },
  { value: 'Gikuyu', label: 'Gikuyu, Kikuyu' },
  { value: 'Greek', label: 'Greek (Modern)' },
  { value: 'Greenlandic', label: 'Greenlandic, Kalaallisut' },
  { value: 'Guarani', label: 'Guarani' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Haitian', label: 'Haitian, Haitian Creole' },
  { value: 'Hausa', label: 'Hausa' },
  { value: 'Hebrew', label: 'Hebrew' },
  { value: 'Herero', label: 'Herero' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Hiri', label: 'Hiri Motu' },
  { value: 'Hungarian', label: 'Hungarian' },
  { value: 'Icelandic', label: 'Icelandic' },
  { value: 'Ido', label: 'Ido' },
  { value: 'Igbo', label: 'Igbo' },
  { value: 'Indonesian', label: 'Indonesian' },
  { value: 'Interlingue', label: 'Interlingue' },
  { value: 'Inuktitut', label: 'Inuktitut' },
  { value: 'Inupiaq', label: 'Inupiaq' },
  { value: 'Irish', label: 'Irish' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Javanese', label: 'Javanese' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Kanuri', label: 'Kanuri' },
  { value: 'Kashmiri', label: 'Kashmiri' },
  { value: 'Kazakh', label: 'Kazakh' },
  { value: 'Kinyarwanda', label: 'Kinyarwanda' },
  { value: 'Komi', label: 'Komi' },
  { value: 'Kongo', label: 'Kongo' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Kwanyama', label: 'Kwanyama, Kuanyama' },
  { value: 'Kurdish', label: 'Kurdish' },
  { value: 'Kyrgyz', label: 'Kyrgyz' },
  { value: 'Lao', label: 'Lao' },
  { value: 'Latin', label: 'Latin' },
  { value: 'Latvian', label: 'Latvian' },
  { value: 'Letzeburgesch', label: 'Letzeburgesch, Luxembourgish' },
  { value: 'Limburgish', label: 'Limburgish, Limburgan, Limburger' },
  { value: 'Lingala', label: 'Lingala' },
  { value: 'Lithuanian', label: 'Lithuanian' },
  { value: 'Luba', label: 'Luba-Katanga' },
  { value: 'Macedonian', label: 'Macedonian' },
  { value: 'Malagasy', label: 'Malagasy' },
  { value: 'Malay', label: 'Malay' },
  { value: 'Malayalam', label: 'Malayalam' },
  { value: 'Maltese', label: 'Maltese' },
  { value: 'Manx', label: 'Manx' },
  { value: 'Maori', label: 'Maori' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Marshallese', label: 'Marshallese' },
  { value: 'Moldovan', label: 'Moldovan, Moldavian, Romanian' },
  { value: 'Mongolian', label: 'Mongolian' },
  { value: 'Nauru', label: 'Nauru' },
  { value: 'Navajo', label: 'Navajo, Navaho' },
  { value: 'Northern', label: 'Northern Ndebele' },
  { value: 'Ndonga', label: 'Ndonga' },
  { value: 'Nepali', label: 'Nepali' },
  { value: 'Northern', label: 'Northern Sami' },
  { value: 'Norwegian', label: 'Norwegian' },
  { value: 'Norwegian', label: 'Norwegian Bokmål' },
  { value: 'Norwegian', label: 'Norwegian Nynorsk' },
  { value: 'Nuosu', label: 'Nuosu, Sichuan Yi' },
  { value: 'Occitan', label: 'Occitan (post 1500)' },
  { value: 'Ojibwa', label: 'Ojibwa' },
  { value: 'Oriya', label: 'Oriya' },
  { value: 'Oromo', label: 'Oromo' },
  { value: 'Ossetian', label: 'Ossetian, Ossetic' },
  { value: 'Pali', label: 'Pali' },
  { value: 'Panjabi', label: 'Panjabi, Punjabi' },
  { value: 'Pashto', label: 'Pashto, Pushto' },
  { value: 'Persian', label: 'Persian' },
  { value: 'Polish', label: 'Polish' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Quechua', label: 'Quechua' },
  { value: 'Romansh', label: 'Romansh' },
  { value: 'Rundi', label: 'Rundi' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Samoan', label: 'Samoan' },
  { value: 'Sango', label: 'Sango' },
  { value: 'Sanskrit', label: 'Sanskrit' },
  { value: 'Sardinian', label: 'Sardinian' },
  { value: 'Serbian', label: 'Serbian' },
  { value: 'Shona', label: 'Shona' },
  { value: 'Sindhi', label: 'Sindhi' },
  { value: 'Sinhala', label: 'Sinhala, Sinhalese' },
  { value: 'Slovak', label: 'Slovak' },
  { value: 'Slovenian', label: 'Slovenian' },
  { value: 'Somali', label: 'Somali' },
  { value: 'Sotho', label: 'Sotho, Southern' },
  { value: 'South', label: 'South Ndebele' },
  { value: 'Spanish', label: 'Spanish, Castilian' },
  { value: 'Sundanese', label: 'Sundanese' },
  { value: 'Swahili', label: 'Swahili' },
  { value: 'Swati', label: 'Swati' },
  { value: 'Swedish', label: 'Swedish' },
  { value: 'Tagalog', label: 'Tagalog' },
  { value: 'Tahitian', label: 'Tahitian' },
  { value: 'Tajik', label: 'Tajik' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Tatar', label: 'Tatar' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Thai', label: 'Thai' },
  { value: 'Tibetan', label: 'Tibetan' },
  { value: 'Tigrinya', label: 'Tigrinya' },
  { value: 'Tonga', label: 'Tonga (Tonga Islands)' },
  { value: 'Tsonga', label: 'Tsonga' },
  { value: 'Tswana', label: 'Tswana' },
  { value: 'Turkish', label: 'Turkish' },
  { value: 'Turkmen', label: 'Turkmen' },
  { value: 'Twi', label: 'Twi' },
  { value: 'Uighur', label: 'Uighur, Uyghur' },
  { value: 'Ukrainian', label: 'Ukrainian' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Uzbek', label: 'Uzbek' },
  { value: 'Venda', label: 'Venda' },
  { value: 'Vietnamese', label: 'Vietnamese' },
  { value: 'Volap_k', label: 'Volap_k' },
  { value: 'Walloon', label: 'Walloon' },
  { value: 'Welsh', label: 'Welsh' },
  { value: 'Western', label: 'Western Frisian' },
  { value: 'Wolof', label: 'Wolof' },
  { value: 'Xhosa', label: 'Xhosa' },
  { value: 'Yiddish', label: 'Yiddish' },
  { value: 'Yoruba', label: 'Yoruba' },
  { value: 'Zhuang', label: 'Zhuang, Chuang' },
  { value: 'Zulu', label: 'Zulu' }
]};
