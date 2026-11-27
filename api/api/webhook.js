
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("Mafateeh Al7al Bot is ready");
  }

  const token = process.env.BOT_TOKEN;
  const channel = process.env.CHANNEL_ID;
  const adminId = process.env.ADMIN_CHAT_ID;

  if (!token || !channel) {
    return res.status(500).send("Missing bot configuration");
  }

  const message = req.body?.message;

  if (!message?.text) {
    return res.status(200).json({ ok: true });
  }

  const chatId = String(message.chat.id);
  const command = message.text.trim().split(" ")[0];

  async function telegram(method, data) {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/${method}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  if (command === "/start" || command === "/id") {
    await telegram("sendMessage", {
      chat_id: chatId,
      text: "أهلًا بك في مساعد مفاتيح الحل 🌟\nرقم محادثتك: " + chatId
    });
  }

  if (command === "/publish") {
    if (!adminId || chatId !== adminId) {
      await telegram("sendMessage", {
        chat_id: chatId,
        text: "هذا الأمر مخصص للمدير."
      });
      return res.status(200).json({ ok: true });
    }

    const result = await telegram("sendMessage", {
      chat_id: channel,
      text: "🧠 تحدي القدرات\n\nإذا كان 3س + 5 = 20، فما قيمة س؟\n\nأ) 3\nب) 5\nج) 7\nد) 15\n\nما إجابتك؟"
    });

    await telegram("sendMessage", {
      chat_id: chatId,
      text: result.ok ? "تم النشر بنجاح ✅" : "تعذر النشر، تحقق من الإعدادات."
    });
  }

  return res.status(200).json({ ok: true });
};
