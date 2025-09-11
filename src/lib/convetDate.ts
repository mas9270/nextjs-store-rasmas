import moment from "moment-jalaali";

// بارگذاری فارسی
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

export function toJalali(input: string | Date, format = "YYYY/MM/DD HH:mm:ss") {
  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    date = new Date(input);
    if (isNaN(date.getTime())) {
      throw new Error("تاریخ نامعتبر است");
    }
  } else {
    throw new Error("ورودی باید از نوع Date یا رشته معتبر باشد");
  }

  return moment(date).format("j" + format);
}
