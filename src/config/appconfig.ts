export default{
      mongoURI : "mongodb+srv://dbReportsProj:myproj1991@cluster0-kfffb.mongodb.net/dbReportsProj?retryWrites=true&w=majority",

     jwt :   {
        "secretOrKey": "secretKey",
        "expiresIn": "7d"
    },

      mail  : {
        "service": "gmail",
        "type": 'oauth2',
        "user": "vadimt2@gmail.com",
        "clientId": "695493167103-eol38bo727eqvf19n1nkqvrbg39vi2j7.apps.googleusercontent.com",
        "clientSecret": "4InpO-1kIko2yxAJUjEDEZpA",
        "accessToken": "ya29.Il-xB2FjmHmHSMRA1ohliXpb_kH9TnyIzH0S_SCN6rnly_1EZ3GKRC_C2kQ4OJv_nKOTkolEElTJKXFhQSVBBdSHLfRNBuH09C9AvyoOTmmO01ppWcPLgHgs2VRtGvikKA",
        "refresh_token" : "1//04J-w-6mrjmMPCgYIARAAGAQSNwF-L9IrPgcLAf_G_PJf2PlZB8Jbtj1BXiWPvk203QafCrgaerGRBAx44jP42uaD0DANh90SFhY"        ,
        "scope": "https://mail.google.com/",
        "token_type":"Bearer",
    },

     options : {
      file: {
        level: 'info',
        filename: `logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
      },
    },

    
}
  



 