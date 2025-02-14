import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // Tôi sử dụng gmail google nên host của tôi là smtp.gmail.com
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.USER_EMAIL, // generated ethereal user
        pass: process.env.PASS_EMAIL,  // generated ethereal password
    },
});


export const handleSendMail = async (data: {
    from?: string;
    to: string; // list of receivers
    subject: string; // Subject line
    text?: string; // plain text body
    html: string; // html body
}) => {
    // hàm const info = await gì đó thì mới dùng trycatch (trycatch xong khởi tạo biến gì đó đó)
    try {
        const res = await transporter.sendMail({
            ...data,
            from: data.from ?? 'jonnguyen1572@gmail.com',
            text: 'Hello',
        });

        // console.log(res);
        return res;
    } catch (error: any) {
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


    // // Tạo dãy 6 số bất kỳ
    // const code = generatorRandomText(6);
    // console.log(code);

    // // Gửi mã số đã tạo tới người dùng 
    // const result = await handleSendMail({
    //     from: '"Maddison Foo Koch 👻" <jonnguyen1572@gmail.com>', // sender address
    //     to: email, // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: `<h1>Mã xác minh ${code}</h1>`, // html body
    // });

    // console.log(result);
    // console.log(code);
};