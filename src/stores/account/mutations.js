import { Status, TypeUpdate } from "@/enums";

const mutations = {
  /**
   * Mô tả: gán danh sách tài khoản vào state
   * created by : vdtien
   * created date: 24-08-2023
   * @param {type} param -
   * @returns
   */
  SET_ACCOOUNTS_LIST(state, payload) {
    state.accountsList = [...payload];
  },

  /**
   * Mô tả: gán danh sách tài khoản con vào dưới tài khoản cha
   * created by : vdtien
   * created date: 24-08-2023
   * @param {type} param -
   * @returns
   */
  SET_ACCOUNT_LIST_CHILDRENS(state, payload) {
    const { parentId, childrens } = payload;
    // tim vi tri cha,
    let parent = state.accountsList.find((acc) => acc.AccountId === parentId);
    let index = state.accountsList.findIndex(
      (acc) => acc.AccountId === parentId
    );

    // insert danh sach con vao duoi cha
    if (index !== -1) {
      let indexParentNext = -1;
      const length = state.accountsList.length;
      let tmpAccoutsList = structuredClone(state.accountsList);
      for (let i = index + 1; i < length; i++) {
        if (tmpAccoutsList[i].Grade === parent.Grade) {
          indexParentNext = i;
          break;
        }
      }
      // xóa các phần từ ở giữa từ parent đến node cùng cấp tiếp theo
      if (indexParentNext !== -1) {
        // index của node cùng cấp với cha - index của cha - 1 = số phần tử ở giữa
        tmpAccoutsList.splice(index + 1, indexParentNext - index - 1);
      } else {
        tmpAccoutsList.splice(index + 1, length - index - 1);
      }
      tmpAccoutsList.splice(index + 1, 0, ...childrens);

      parent.IsParent = 1;
      parent.showChild = true;
      parent.NumberChilds = childrens.length;
      tmpAccoutsList.splice(index, 1, { ...parent });
      state.accountsList = [...tmpAccoutsList];
    }
  },

  /**
   * Mô tả: gán danh sách tài khoản con vào  dưới danh sách tài khoản cha
   * created by : vdtien
   * created date: 24-08-2023
   * @param {type} param -
   * @returns
   */
  SET_LIST_ACCOUNT_CHILDRENS_TO_PARENTS(state, payload) {
    let tmpAccoutsList = [...state.accountsList];

    for (const account of payload) {
      const parentIndex = tmpAccoutsList.findIndex(
        (acc) => acc.AccountId === account.ParentId
      );
      if (parentIndex !== -1) {
        tmpAccoutsList.splice(parentIndex + 1, 0, account);
      }
    }

    state.accountsList = [...tmpAccoutsList];
  },

  /**
   * Mô tả: gán thôn tin 1 tài khoản vào state
   * created by : vdtien
   * created date: 24-08-2023
   * @param {type} param -
   * @returns
   */
  SET_ACCOUNT_DETAIL(state, payload) {
    state.accountDetail = { ...payload };
  },

  /**
   * Mô tả: ẩn hiện tài khoản con
   * created by : vdtien
   * created date: 24-08-2023
   * @param {type} param -
   * @returns
   */
  TOGGLE_SHOW_CHILD(state, payload) {
    // console.log(state);
    let index = state.accountsList.findIndex(
      (acc) => acc.AccountId === payload
    );
    let account = state.accountsList.find((acc) => acc.AccountId === payload);
    if (index !== -1) {
      let tmpAccoutsList = [...state.accountsList];
      account.showChild = !account.showChild;
      tmpAccoutsList.splice(index, 1, account);
      state.accountsList = [...tmpAccoutsList];
    }
  },

  /**
   * Mô tả: ẩn hiện
   * created by : vdtien
   * created date: 24-08-2023
   * @param {type} param -
   * @returns
   */
  TOGGLE_SHOW_ALL(state, payload) {
    let tmpAccoutsList = [...state.accountsList];
    tmpAccoutsList = tmpAccoutsList.map((obj) => ({
      ...obj,
      showChild: payload,
    }));
    state.accountsList = [...tmpAccoutsList];
  },
  /**
   * Mô tả: them moi 1 ban ghi
   * created by : vdtien
   * created date: 23-07-2023
   * @param {type} param -
   * @returns
   */
  CREATE_ACCOUNT(state, payload) {
    let newAccount = { ...payload };
    state.accountsList.unshift(newAccount);
  },

  /**
   * Mô tả: Cap nhat tai khoan
   * created by : vdtien
   * created date: 23-07-2023
   * @param {type} param -
   * @returns
   */
  UPDATE_ACCOUNT(state, payload) {
    let account = { ...payload };
    let tmpAccountsList = [...state.accountsList];
    // tim tai khoan cu
    let accountPrev = state.accountsList.find(
      (acc) => acc.AccountId === account.AccountId
    );
    let index = state.accountsList.findIndex(
      (acc) => acc.AccountId === account.AccountId
    );
    // thay đổi nhánh
    if (accountPrev && accountPrev.ParentId != account.ParentId) {
      // parent old khac null
      if (accountPrev.ParentId) {
        let parentOld = tmpAccountsList.find(
          (acc) => acc.AccountId === accountPrev.ParentId
        );
        let indexParentOld = tmpAccountsList.find(
          (acc) => acc.AccountId === accountPrev.ParentId
        );

        if (indexParentOld !== -1) {
          parentOld.NumberChilds -= 1;
          parentOld.IsParent = parentOld.NumberChilds > 0 ? 1 : 0;
          tmpAccountsList.splice(indexParentOld, 1, { ...parentOld });
        }
      }
    }
    // xoa node cu di
    if (index != -1) {
      tmpAccountsList.splice(index, 1);
    }
    let parenNode = tmpAccountsList.find(
      (acc) => acc.AccountId === account.ParentId
    );
    let indexParent = tmpAccountsList.findIndex(
      (acc) => acc.AccountId === account.ParentId
    );

    if (indexParent !== -1) {
      parenNode.NumberChilds += 1;
      parenNode.IsParent = 1;
      tmpAccountsList.splice(indexParent, 1, { ...parenNode });
      if (parenNode.showChild) {
        tmpAccountsList.splice(indexParent + 1, 0, account);
      }
    }

    state.accountsList = [...tmpAccountsList];
  },

  UPDATE_ACCOUNT_STATUS(state, payload) {
    const { accountId, status, type } = payload;
    let tmpAccountList = [...state.accountsList];
    let account = tmpAccountList.find((acc) => acc.AccountId === accountId);
    if (account && account.KeyCode) {
      if (status === Status.using && type === TypeUpdate.one) {
        let index = tmpAccountList.findIndex(
          (acc) => acc.AccountId === accountId
        );

        if (index != -1) {
          account.Status = status;
          tmpAccountList.splice(index, 1, account);
        }
      } else if (status === Status.using && type === TypeUpdate.all) {
        tmpAccountList.forEach((acc) => {
          if (acc.KeyCode.includes(account.KeyCode)) {
            acc.Status = status;
          }
        });
      } else if (status === Status.stopUsing) {
        tmpAccountList.forEach((acc) => {
          if (acc.KeyCode.includes(account.KeyCode)) {
            acc.Status = Status.stopUsing;
          }
        });
      }
      state.accountsList = [...tmpAccountList];
    }
  },

  /**
   * Mô tả:xoa tai khoan theo id
   * created by : vdtien
   * created date: 20-07-2023
   * @param {type} param -
   * @returns
   */
  DELETE_ACCOUNT(state, payload) {
    const index = state.accountsList.findIndex(
      (acc) => acc.AccountId === payload.AccountId
    );
    let tmpAccountsList = [...state.accountsList];
    if (payload.ParentId) {
      const indexParent = state.accountsList.findIndex(
        (acc) => acc.AccountId === payload.ParentId
      );
      const parentNode = state.accountsList.find(
        (acc) => acc.AccountId === payload.ParentId
      );
      if (indexParent != -1) {
        parentNode.NumberChilds -= 1;
        if (parentNode.NumberChilds === 0) {
          parentNode.IsParent = 0;
        }
        tmpAccountsList.splice(indexParent, 1, { ...parentNode });
      }
    }
    // console.log(index);
    if (index !== -1) {
      tmpAccountsList.splice(index, 1);
      // console.log(tmpAccountList);
    }
    state.accountsList = [...tmpAccountsList];
  },

  /**
   * Mô tả: gán tài khoản vào dưới tài khoản cha
   * created by : vdtien
   * created date: 24-08-2023
   * @param {type} param -
   * @returns
   */
  SET_CHILD_TO_PARENT(state, payload) {
    const { indexParent, child } = payload;
    const parent = state.accountsList[indexParent];
    parent.IsParent = 1;
    parent.NumberChilds += 1;
    parent.showChild = true;

    const tmpList = structuredClone(state.accountsList);
    tmpList.splice(indexParent + 1, 0, child);
    state.accountsList = tmpList;
  },
};
export default mutations;
