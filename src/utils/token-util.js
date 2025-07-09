/**
 * token操作封装
 */
import { TOKEN_CACHE_NAME } from '@/config/setting';
import Cookies from 'js-cookie';
import { aesEncrypt, aesDecrypt } from '@/utils/crypt';

export const userNameKey = 'zachairah-userName';
export const passwordKey = 'zachairah-password';
export const isRememberMeKey = 'zachairah-isRememberMe';
/**
 * 获取缓存的token
 */
export function getToken() {
  const token = localStorage.getItem(TOKEN_CACHE_NAME);
  if (!token) {
    return sessionStorage.getItem(TOKEN_CACHE_NAME);
  }
  return token;
}

/**
 * 缓存token
 * @param token token
 * @param remember 是否永久存储
 */
export function setToken(token, remember) {
  removeToken();
  if (token) {
    if (remember) {
      localStorage.setItem(TOKEN_CACHE_NAME, token);
    } else {
      sessionStorage.setItem(TOKEN_CACHE_NAME, token);
    }
  }
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_CACHE_NAME);
  sessionStorage.removeItem(TOKEN_CACHE_NAME);
}

export function savePassword(password) {
  const encryptPassword = aesEncrypt(password);
  Cookies.set(passwordKey, encryptPassword);
}

/** 将密码中cookies中删除 */
export function removePassword() {
  Cookies.remove(passwordKey);
}
export function saveUserName(userName) {
  Cookies.set(userNameKey, userName);
}

export function getUserName() {
  return Cookies.get(userNameKey);
}

export function removeUserName() {
  Cookies.remove(userNameKey);
}
/** 获取密码 并解密 */
export function getPassword() {
  const encryptPassword = Cookies.get(passwordKey);
  if (
    encryptPassword !== null &&
    encryptPassword !== undefined &&
    encryptPassword.trim() !== ''
  ) {
    return aesDecrypt(encryptPassword);
  }
  return null;
}

export function saveIsRememberMe(isRememberMe) {
  Cookies.set(isRememberMeKey, isRememberMe.toString());
}

export function getIsRememberMe() {
  const value = Cookies.get(isRememberMeKey);
  return value === 'true';
}
