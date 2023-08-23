import { v4 as uuidv4 } from "uuid";
import { AccountFeature, Gender, Status, TypeCol } from "@/enums";

/**
 * Mô tả: trả về uuid làm key cho danh sách
 * created by : vdtien
 * created date: 22-08-2023
 * @param {type} param -
 * @returns
 */
function generateUniqueId() {
  return uuidv4();
}
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Mô tả: convert title
 * created by : vdtien
 * created date: 20-08-2023
 * @param {type} param -
 * @returns
 */
function converTitle(label, key) {
  let text = label;
  switch (key) {
    case TypeCol.date:
      text = convertToDDMMYYYY(label);
      break;

    default:
      break;
  }
  return text;
}

function converGender(genderType) {
  let gender = "";
  switch (genderType) {
    case Gender.male:
      gender = "Nam";
      break;
    case Gender.female:
      gender = "Nữ";
      break;
    case Gender.other:
      gender = "Khác";
      break;
    default:
      break;
  }
  return gender;
}
/**
 * Mô tả: Kiem tra xem chuoi do co dang date khoong
 * created by : vdtien
 * created date: 18-06-2023
 * @param {type} param -
 * @returns boolean
 */
function isValidDate(dateString) {
  let date = new Date(dateString);
  return !isNaN(date);
}

/**
 * Mô tả: Convert string ve dd/mm/yyyy
 * created by : vdtien
 * created date: 18-06-2023
 * @param {type} param -
 * @returns "dd/mm/yyy" || ""
 */
function convertToDDMMYYYY(dateString) {
  if (!isValidDate(dateString)) {
    return "";
  }

  let date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 (0 - 11), nên cộng thêm 1
  let year = date.getFullYear();

  // Đảm bảo rằng ngày và tháng luôn có 2 chữ số
  let formattedDay = ("0" + day).slice(-2);
  let formattedMonth = ("0" + month).slice(-2);

  let formattedDate = formattedDay + "/" + formattedMonth + "/" + year;

  return formattedDate;
}
function convertToYYYYMMDD(dateString) {
  if (!isValidDate(dateString)) {
    return "";
  }

  let date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 (0 - 11), nên cộng thêm 1
  let year = date.getFullYear();

  // Đảm bảo rằng ngày và tháng luôn có 2 chữ số
  let formattedDay = ("0" + day).slice(-2);
  let formattedMonth = ("0" + month).slice(-2);

  let formattedDate = year + "-" + formattedMonth + "-" + formattedDay;

  return formattedDate;
}

function removeEmptyFields(obj) {
  for (let key in obj) {
    if (obj[key] === "" || obj[key] === null) {
      delete obj[key];
    }
  }
  return obj;
}
function removeEmptyFieldsDeep(obj) {
  if (typeof obj === "object")
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          obj[key] === null ||
          obj[key] === undefined ||
          (typeof obj[key] === "object" &&
            Object.keys(obj[key]).length === 0) ||
          (Array.isArray(obj[key]) && obj[key].length === 0) ||
          (typeof obj[key] === "string" && obj[key].trim() === "")
        ) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          removeEmptyFieldsDeep(obj[key]);
        }
      }
    }
}

/**
 * Mô tả: kiểm tra 1 mảng có chứa các phần tử của 1 mảng khác không (chuyển tham chiếu thành string)
 * created by : vdtien
 * created date: 06-06-2023
 * @param {type} param -
 * @returns true or false
 */
function areAllElementsInArray(subArr, priArr) {
  const result = subArr.every((element) => priArr.includes(element));
  return result;
}

/**
 * Mô tả: Lay ra cac phan tu o subArr khong o priArr
 * created by : vdtien
 * created date: 06-06-2023
 * @param {type} param -
 * @returns []
 */
function uniqueElementsArray(subArr, priArr) {
  const uniqueElements = subArr.filter((element) => !priArr.includes(element));
  return uniqueElements;
}

/**
 * Mô tả: xoa cac phan tu trong mang con o mang goc
 * created by : vdtien
 * created date: 06-06-2023
 * @param {type} param -
 * @returns
 */
function removeSubArrayElements(subArr, priArr) {
  const newArr = priArr.filter((element) => !subArr.includes(element));
  return newArr;
}

function containsOnlyNumbers(str) {
  return !isNaN(str);
}

function nestTreeData(items, parentId = null) {
  // Chuyển đổi dữ liệu thành định dạng mong muốn
  const result = [];

  for (const item of items) {
    if (item.ParentId === parentId) {
      const children = nestTreeData(items, item.AccountId);

      if (children.length > 0) {
        result.push({
          ...item,
          showChild: false,
          children: children,
        });
      } else {
        result.push({
          ...item,
          showChild: false,
        });
      }
    }
  }

  return result;
}

function converAccountFeature(accountFeature) {
  let featureName = "";
  switch (accountFeature) {
    case AccountFeature.debt:
      featureName = "Dư nợ";
      break;
    case AccountFeature.redundant:
      featureName = "Dư có";
      break;
    case AccountFeature.combine:
      featureName = "Lưỡng tính";
      break;
    case AccountFeature.noBalance:
      featureName = "Không có số dư";
    default:
      break;
  }
  return featureName;
}

function converStatusField(status) {
  let text = "";
  switch (status) {
    case Status.stopUsing:
      text = "Ngưng sử dụng";
      break;
    case Status.using:
      text = "Sử dụng";
      break;
    default:
      text = "Ngưng sử dụng";
      break;
  }
  return text;
}
function parseJson(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}
function stringifyJson(data) {
  try {
    return JSON.stringify(data);
  } catch (error) {
    return null;
  }
}
// function formatDecimal(number) {
//   const parts = number.toLocaleString("de-DE").split(",");
//   const formattedNumber = parts[0].replace(/\./g, "") + "," + parts[1];
//   return formattedNumber;
// }
function formatDecimal(number) {
  if (typeof number !== "number") number = 0;
  const formattedNumber = Math.abs(number).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (number < 0) {
    return `(${formattedNumber})`;
  } else {
    return formattedNumber;
  }
}
function containsOnlyNumber(str) {
  return /^\d+$/.test(str);
}
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}
function containsOnlyAlphanumeric(inputString) {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(inputString);
}
export {
  removeDiacritics,
  converGender,
  removeEmptyFields,
  areAllElementsInArray,
  uniqueElementsArray,
  removeSubArrayElements,
  convertToDDMMYYYY,
  convertToYYYYMMDD,
  containsOnlyNumbers,
  nestTreeData,
  converAccountFeature,
  converStatusField,
  parseJson,
  stringifyJson,
  formatDecimal,
  converTitle,
  containsOnlyNumber,
  isValidEmail,
  containsOnlyAlphanumeric,
  removeEmptyFieldsDeep,
  generateUniqueId,
  isValidDate,
};
