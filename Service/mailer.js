const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'weindic.inc@gmail.com',  // Your email address
        pass: 'kgof qncb ogjv nroa'           // Your email password (You might need to generate an app password)
    }
});

// Function to send email
// exports.sendEmail = (toEmail, subject, text, html) =>{
//     // Define email options
//     const mailOptions = {
//         from: 'help@recyclebaba.com',   // Sender address
//         to: toEmail,                    // Recipient address
//         subject: subject,               // Email subject
//         text: text,                     // Plain text body
//         html: html                      // HTML body
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//         } else {
//             console.log('Email sent:', info.response);
//         }
//     });
// }




exports.sendSignupMail = (email, mobile, fullName) =>{

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to RecycleBaba</title>
        <style>
            /* Inline CSS styles for email */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                margin: 20px;
                border-radius: 5px;
            }
            h1 {
                color: #333333;
            }
            p {
                color: #555555;
                line-height: 1.5;
            }
            .footer {
                margin-top: 20px;
                color: #888888;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to RecycleBaba!</h1>
            <p>Hello [User_Name],</p>
            <p>Thank you for signing up with RecycleBaba! We are thrilled to have you join our community of environmentally conscious individuals.</p>
            <p>Here are your details:</p>
            <ul>
                <li>Name:  ${fullName}</li>
                <li>Email: ${email}</li>
                <li>Mobile:  ${mobile}</li>
            
            </ul>
            <p>This is automated generated mail to know more contact at support@recyclebaba.com.</p>
   
            <p>Best Regards,</p>
            <p>The RecycleBaba Team</p>
            <div class="footer">
                <p>RecycleBaba &copy; 2024 | All rights reserved</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Define email options
    const mailOptions = {
        from: 'help@recyclebaba.com',   // Sender address
        to: 'mohit.itechmission@gmail.com',                    // Recipient address
        subject: 'New Customer Registred With Recyclebaba '+fullName,               // Email subject
                   
        html: html                      // HTML body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            sendSignupMailToUser(email, mobile, fullName)
            console.log('Email sent:', info.response);
        }
    });
}


exports.sendSignupMailToUser =(email, mobile, fullName) =>{

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to RecycleBaba</title>
        <style>
            /* Inline CSS styles for email */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                margin: 20px;
                border-radius: 5px;
            }
            h1 {
                color: #333333;
            }
            p {
                color: #555555;
                line-height: 1.5;
            }
            .footer {
                margin-top: 20px;
                color: #888888;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to RecycleBaba!</h1>
            <p>Hello  ${fullName},</p>
            <p>Thank you for signing up with RecycleBaba! We are thrilled to have you join Best online scrap dealing app.</p>
            <p>Here are your details:</p>
            <ul>
               <li>Name: ${fullName}</li>
                <li>Email: ${email}</li>
                <li>Mobile: ${mobile}</li>
               
            </ul>
            <p>If you have any questions or need assistance, feel free to contact us at support@recyclebaba.com.</p>
            <p>Thank you for being a part of RecycleBaba!</p>
            <p>Best Regards,</p>
            <p>The RecycleBaba Team</p>
            <div class="footer">
                <p>RecycleBaba &copy; 2024 | All rights reserved</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Define email options
    const mailOptions = {
        from: 'help@recyclebaba.com',   // Sender address
        to: 'mohit.itechmission@gmail.com',                    // Recipient address
        subject: 'New Customer Registred With Recyclebaba '+fullName,               // Email subject
                   
        html: html                      // HTML body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}






exports.sendOrderMailToAdmin = async (order) =>{




    const finalTotal = order?.scrapDetails.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.totalPrice;
    }, 0);

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Order Details - RecycleBaba - #${order?.orderCode}</title>
        <style>
            /* Inline CSS styles for email */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                margin: 20px;
                border-radius: 5px;
            }
            h1, h3 {
                color: #333333;
            }
            p, table {
                color: #555555;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            table, th, td {
                border: 1px solid #dddddd;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
                text-align: left;
            }
            .footer {
                margin-top: 20px;
                color: #888888;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Details</h1>
            <h2 style="color:'green'; font-weight:600">Order ID: #${order?.orderCode}</h2>
            <table>
                <tr>
       
                    <th>Order Code</th>
                    <th>Name</th>
                    <th>Customer Whatsapp</th>
                   
                    <th>Email</th>
                    <th>Address</th>
                    <th>Total Amount</th>
                </tr>
                <!-- Table row example -->

                <tr>
            
  
                <td>${order?.orderCode}</td>
                <td>${order?.orderDetails?.basicInfo?.fullName}</td>
                <td>${order?.userDatails?.basicInfo?.whatsappNumber}</td>
                <td>${order?.userDatails?.basicInfo?.email}</td>
                <td>${order?.userDatails?.basicInfo?.address} ,${order?.userDatails?.basicInfo?.city}, ${order?.userDatails?.basicInfo?.state}, ${order?.userDatails?.basicInfo?.pin} </td>
    
                <td>₹ ${finalTotal}</td>
            </tr>
               
                <!-- Add more rows here as needed -->
            </table>
          
            <p>Thank you for your order with RecycleBaba! If you have any questions, please contact us at support@recyclebaba.com.</p>
            <div class="footer">
                <p>RecycleBaba &copy; 2024 | All rights reserved</p>
            </div>
        </div>
    </body>
    </html>
    
    `;

    // Define email options
    const mailOptions = {
        from: 'help@recyclebaba.com',   // Sender address
        to: 'mohit.itechmission@gmail.com',                    // Recipient address
        subject: 'New Order Recieved  - #'+ order?.orderCode,               // Email subject
                   
        html: html                      // HTML body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            sendOrderMailToUser(order)
            console.log('Email sent:', info.response);
        }
    });
}


exports.sendOrderMailToUser = async (order) =>{




    const finalTotal = order?.scrapDetails.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.totalPrice;
    }, 0);

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Order Details - RecycleBaba - #${order?.orderCode}</title>
        <style>
            /* Inline CSS styles for email */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                margin: 20px;
                border-radius: 5px;
            }
            h1, h3 {
                color: #333333;
            }
            p, table {
                color: #555555;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            table, th, td {
                border: 1px solid #dddddd;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
                text-align: left;
            }
            .footer {
                margin-top: 20px;
                color: #888888;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Details</h1>
            <h2 style="color:'green'; font-weight:600">Order ID: #${order?.orderCode}</h2>
            <table>
                <tr>
       
                    <th>Order Code</th>
                    <th>Name</th>
                    <th>Customer Whatsapp</th>
                   
                    <th>Email</th>
                    <th>Address</th>
                    <th>Total Amount</th>
                </tr>
                <!-- Table row example -->

                <tr>
            
  
                <td>${order?.orderCode}</td>
                <td>${order?.orderDetails?.basicInfo?.fullName}</td>
                <td>${order?.userDatails?.basicInfo?.whatsappNumber}</td>
                <td>${order?.userDatails?.basicInfo?.email}</td>
                <td>${order?.userDatails?.basicInfo?.address} ,${order?.userDatails?.basicInfo?.city}, ${order?.userDatails?.basicInfo?.state}, ${order?.userDatails?.basicInfo?.pin} </td>
    
                <td>₹ ${finalTotal}</td>
            </tr>
               
                <!-- Add more rows here as needed -->
            </table>
          
            <p>Thank you for your order with RecycleBaba! If you have any questions, please contact us at support@recyclebaba.com.</p>
            <div class="footer">
                <p>RecycleBaba &copy; 2024 | All rights reserved</p>
            </div>
        </div>
    </body>
    </html>
    
    `;

    // Define email options
    const mailOptions = {
        from: 'help@recyclebaba.com',   // Sender address
        to: 'mohit.itechmission@gmail.com',                    // Recipient address
        subject: 'Thanks For The Order  - #'+ order?.orderCode,               // Email subject
                   
        html: html                      // HTML body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}



