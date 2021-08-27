'use strict';



function templateEmailAssist_es(nickName,eventLink, stringDate){

const email = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <title>4Events</title>

</head>
<body style="font-family:Arial, Helvetica, sans-serif; background-color: #FBF9F6; margin:0">
<br>

<table width="600" border="0" cellspacing="0" align="center" style="background-color: #ffffff;">
    <tr>
        <td style="padding: 0;">
            <img src="http://localhost:3000/logo4eventsemail.png" alt="4events" style="width: 400px; padding-left: 100px; padding-top: 20px;">
        </td>
    </tr>
    <tr>
        <td  style="padding: 30px; border-bottom: 2px solid rgb(32, 212, 137) !important">
            <h3 style="color:#171C31">Hola ${nickName},</h3>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#666666; line-height: 21px">
                Te enviamos este email para confirmar que te hemos dado de baja en el evento que has elegido y que se iba a celebrar el ${stringDate}.
            </p>

            </br>
         
            <table width="100%" border="0" style="font-family:Arial, Helvetica, sans-serif;  font-size:18px; color: #19b674; background-color: #f5f8fa;" >
                <tbody>
                <tr>
                    <td style=" border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d8dbdf; color: #171C31; padding: 10px">
                        <strong>Evento, baja de suscripción</strong>
                    </td>
                </tr>
                <tr>
                    <td style="font-size:14px; color: #005181; padding: 10px">
                        <strong>
                            <!-- Poner aquí: enlace a URL para reestablecer contraseña -->
                                <a href="${eventLink}"> Link para acceder al evento</a>
                            <br />
                        
                        </strong>
                    </td>
                </tr>
                </tbody>
            </table>

            <br />

            
                    
            <!-- 3º BLOCK -->
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#666666; line-height: 21px">
                Si tienes alguna duda o necesitas más detalles, puedes contactar con nosotros escribiendo al email <a style="color:#19b674;  font-weight:600;" mailto="info@4events.net">info@4events.net</a>
            </p>
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#666666; line-height: 21px; ">
                Un saludo,
                <br/>
                <i style="color:#171C31;"><strong>GuardianesdelaNoche</strong></i>
                <br/>
            </p>
        </td>
    </tr>
</table>
<br/>
<table width="600" border="0" cellspacing="0" align="center">
    
    <tr>
        <td valign="top" style="padding:0px;">
            <p style="font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#666666; text-align: justify; line-height: 12px; margin-top:10px;">
                Este email ha sido enviado automáticamente, por favor, no respondas al mismo. Recibes este mensaje porque recientemente te has dado de baja en un evento
            </p>
            <br /><br />
        </td>
    </tr>
</table>
</body>
</html>`;

return email;

}

module.exports = templateEmailAssist_es;