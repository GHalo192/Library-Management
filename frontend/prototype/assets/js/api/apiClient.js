// Backend-agnostic adapter. Change USE_MOCK=false and API_BASE_URL when backend is ready.
import {readDB,saveDB,nextId} from '../core/storage.js';
export const API_BASE_URL='http://localhost:8080/api';
export const USE_MOCK=true;
export async function request(path,{method='GET',body}={}){if(USE_MOCK)throw new Error('Use the mock services while USE_MOCK=true');const res=await fetch(API_BASE_URL+path,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});if(!res.ok)throw new Error(`HTTP ${res.status}`);return res.status===204?null:res.json()}
export const db={read:readDB,write:saveDB,id:nextId};
