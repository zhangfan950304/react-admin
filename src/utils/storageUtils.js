
//也可以使用store进行封装
module.exports = {
    saveUser(user){
        localStorage.setItem('user_key',JSON.stringify(user));
    },

    getUser(){
        return JSON.parse(localStorage.getItem('user_key')|| "{}");
    },
    delUser(){
        localStorage.removeItem("user_key");
    }
}