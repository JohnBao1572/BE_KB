import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
    },
});


export const handleSendMail = async (data: {
    from: string,
    to: string, // list of receivers
    subject: string, // Subject line
    text: string, // plain text body
    html: string, // html body
}) => {
    // hàm const info = await gì đó thì mới dùng trycatch (trycatch xong khởi tạo biến gì đó đó)
    try {
        const res = await transporter.sendMail(data);
        console.log(res);
    } catch (error:any) {
        throw new Error(error.message)
    }
    // Còn bỏ khởi tạo biến (info) là hàm callback nên dùng thencatch (trong trường hợp lỗi cũng sẽ dễ nhận biết hơn)
    // await transporter.sendMail({
    //     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    //     to: "jonnguyen1572@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    // })
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     })

    // send mail with defined transport object
    
};