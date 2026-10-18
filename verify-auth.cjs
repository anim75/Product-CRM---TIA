'use strict';
const assert=require('node:assert/strict'),{read,register,login,update,storageKey}=require('./local-auth.js');
const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
async function run(){
 assert.equal(read(storage),null);
 const account={name:'Test User',email:'TEST@example.com',password:'Test-password-123',confirmPassword:'Test-password-123'};
 await assert.rejects(()=>register(storage,{...account,confirmPassword:'Other-password'}),/do not match/);
 await assert.rejects(()=>register(storage,{...account,password:'short',confirmPassword:'short'}),/10 and 128/);
 const profile=await register(storage,account);assert.deepEqual(profile,{name:'Test User',email:'test@example.com'});
 const stored=JSON.parse(storage.getItem(storageKey));assert.equal(stored.hash.length,64);assert.equal(stored.salt.length,32);assert.equal(stored.iterations,210000);assert.ok(!storage.getItem(storageKey).includes(account.password));
 await assert.rejects(()=>register(storage,account),/already exists/);
 await assert.rejects(()=>login(storage,{email:account.email,password:'Wrong-password-123'}),/incorrect/);
 await assert.rejects(()=>login(storage,{email:'other@example.com',password:account.password}),/incorrect/);
 assert.deepEqual(await login(storage,account),profile);
 await assert.rejects(()=>update(storage,{email:'new@example.com',currentPassword:'Wrong-password-123'}),/incorrect/);
 await assert.rejects(()=>update(storage,{email:'new@example.com',currentPassword:account.password,newPassword:'Changed-password-123',confirmPassword:'Different-password'}),/match/);
 await update(storage,{email:'new@example.com',currentPassword:account.password,newPassword:'Changed-password-123',confirmPassword:'Changed-password-123'});
 await assert.rejects(()=>login(storage,account),/incorrect/);
 assert.equal((await login(storage,{email:'new@example.com',password:'Changed-password-123'})).email,'new@example.com');
 assert.notEqual(read(storage).salt,stored.salt);assert.ok(!storage.getItem(storageKey).includes('Changed-password-123'));
 const denied={getItem:()=>null,setItem(){throw Error('Storage denied');}};await assert.rejects(()=>register(denied,account),/Storage denied/);
 assert.equal(read({getItem:()=>'{bad json'}),null);
 console.log('Passed: signup, confirmation/length validation, PBKDF2 hash and salt, no plaintext password, duplicate signup, incorrect credentials, successful sign-in and storage failures.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
