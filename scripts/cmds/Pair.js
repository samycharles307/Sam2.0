const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "pair",
    version: "3.0",
    author: "ChatGPT",
    role: 0,
    category: "fun",
    shortDescription: "Love pairing with styled text",
  },

  onStart: async function ({ api, event, usersData }) {
    let loadingMsg;

    try {
      // Message temporaire simple
      loadingMsg = await api.sendMessage(
        "💘 Your love match is being generated...",
        event.threadID,
        event.messageID
      );

      // Infos du groupe
      const threadInfo = await api.getThreadInfo(event.threadID);

      const members = threadInfo.participantIDs.filter(
        id => id !== event.senderID && id !== api.getCurrentUserID()
      );

      if (members.length === 0) {
        return api.sendMessage("❌ No users found in this group.", event.threadID);
      }

      // Choix aléatoire
      const partnerID = members[Math.floor(Math.random() * members.length)];

      const name1 = await usersData.getName(event.senderID);
      const name2 = await usersData.getName(partnerID);

      // Photos Graph
      const fb1 = `https://graph.facebook.com/${event.senderID}/picture?type=large`;
      const fb2 = `https://graph.facebook.com/${partnerID}/picture?type=large`;

      // Upload Imgbb
      const img1 = (await axios.get(
        `https://xsaim8x-xxx-api.onrender.com/api/imgbb?url=${encodeURIComponent(fb1)}`
      )).data.image.display_url;

      const img2 = (await axios.get(
        `https://xsaim8x-xxx-api.onrender.com/api/imgbb?url=${encodeURIComponent(fb2)}`
      )).data.image.display_url;

      // Canvas
      const canvas = createCanvas(900, 500);
      const ctx = canvas.getContext("2d");

      // Fond rose
      ctx.fillStyle = "#ffb6c1";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Charger avatars
      const av1 = await loadImage(img1);
      const av2 = await loadImage(img2);

      const drawAvatar = (img, x) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, 250, 100, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x - 100, 150, 200, 200);
        ctx.restore();
      };

      drawAvatar(av1, 225);
      drawAvatar(av2, 675);

      // Texte stylé sur image
      const styledText = `
َ.  
     ‘   ๛ ⌯  𝗜 𝗱𝗼𝗻’𝘁 𝘄𝗮𝗶𝘁 𝗳𝗼𝗿 𝗳𝗮𝘁𝗲   .°  ⊹  
َ       .      𝗜 𝗰𝗿𝗲𝗮𝘁𝗲 𝗺𝘆 𝗼𝘄𝗻 𝗴𝗼𝗮𝗹   .⁽💞₎

💘 𝗣𝗮𝗶𝗿 : ${name1} × ${name2}
`;

      ctx.font = "22px Arial";
      ctx.fillStyle = "#ff1493";
      ctx.textAlign = "center";

      const lines = styledText.trim().split("\n");
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 50 + index * 35);
      });

      const buffer = canvas.toBuffer();

      // Supprimer le message temporaire
      if (loadingMsg?.messageID) await api.unsendMessage(loadingMsg.messageID);

      // Envoyer le message final avec l'image
      return api.sendMessage(
        {
          body: "💘 Your love match is ready! 💘",
          attachment: buffer
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.error(err);
      if (loadingMsg?.messageID) await api.unsendMessage(loadingMsg.messageID);
      api.sendMessage("❌ An error occurred while generating the pair.", event.threadID);
    }
  }
};
