import { Gender } from "@/enums";

function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
function converDate(dateTime) {}

function removeEmptyFields(obj) {
  for (let key in obj) {
    if (obj[key] === "" || obj[key] === null) {
      delete obj[key];
    }
  }
  return obj;
}

export { removeDiacritics, converGender, removeEmptyFields };
