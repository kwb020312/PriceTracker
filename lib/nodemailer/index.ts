"use server";

import { EmailContent, EmailProductInfo, NotificationType } from "@/types";
import nodemailer from "nodemailer";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
) {
  const THRESHOLD_PERCENTAGE = 40;
  // Shorten the product title
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `${shortenedTitle} 상품을 찾아주셔서 감사합니다!`;
      body = `
        <div>
          <h2>PriceTracker 서비스를 이용해주신 것 감사드려요🚀</h2>
          <p>찾고 있는 상품은 ${product.title}.</p>
          <p>앞으로 어떤 방식의 메일을 받게될지 알려드려요:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} 상품이 입고되었어요!</h3>
            <p>${product.title} 상품의 수량이 발견되어 호다닥 가져왔어요!</p>
            <p>이번 기회 놓치지 마세요! - <a href="${product.url}" target="_blank" rel="noopener noreferrer">구매하기</a>!</p>
            <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>이번 기회에 ${product.title} 상품 외의 다른 상품들도 알아보세요!</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} 상품이 재입고되었어요!`;
      body = `
        <div>
          <h4>${product.title} 상품을 이번엔 꼭 구매해보세요!</h4>
          <p><a href="${product.url}" target="_blank" rel="noopener noreferrer">상품 조회하기</a></p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `${shortenedTitle} 상품 이번이 가장 저렴해요!`;
      body = `
        <div>
          <h4>${product.title} 상품이 현재 가장 저렴한 가격에 판매되고 있어요!</h4>
          <p><a href="${product.url}" target="_blank" rel="noopener noreferrer">상품 조회하기</a></p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `${shortenedTitle} 상품이 지금 할인중이에요!`;
      body = `
        <div>
          <h4>${product.title} 의 현재 가격이 ${THRESHOLD_PERCENTAGE}% 할인중이에요!</h4>
          <p><a href="${product.url}" target="_blank" rel="noopener noreferrer">상품 조회하기</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  service: "naver",
  host: "smtp.naver.com",
  secure: false,
  requireTLS: true,
  auth: {
    user: "kwb020312@naver.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  port: 587,
});

export const sendEmail = async (
  emailContent: EmailContent,
  sendTo: string[]
) => {
  const mailOptions = {
    from: "kwb020312@naver.com",
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      console.log("Email sent: ", info);
      resolve("success");
    });
  });
};
