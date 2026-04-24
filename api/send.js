import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

  try {
    const { name, phone, email, interest, message } = req.body;

    if (!name || !phone || !interest) {
      return res.status(400).json({ message: "Заполните обязательные поля" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Family Story" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "🏡 Новая заявка с Family Story",
      html: `
        <h2>Новая заявка с сайта Family Story</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "не указан"}</p>
        <p><strong>Интерес:</strong> ${interest}</p>
        <p><strong>Комментарий:</strong><br>${message || "нет комментария"}</p>
      `
    });

    return res.status(200).json({ message: "Заявка отправлена" });
  } catch (error) {
    console.error("Send mail error:", error);
    return res.status(500).json({ message: "Ошибка отправки" });
  }
}
