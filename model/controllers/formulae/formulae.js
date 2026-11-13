function calcD(user1, user2){
    var i = 0
    var user1user2D = 0
    if(user1.length >= user2.length){
        user1.forEach((element, index) => {
            if(user2[index] != null && element != null){
                user1user2D = user1user2D + ((user2[index] - element) ** 2)
                i++
            }
        });
    }else{
        user2.forEach((element, index) => {
            if(user1[index] != null && element != null){
                user1user2D = user1user2D + ((user2[index] - element) ** 2)
                i++
            }
        });
    }
    if(i > 0){
        return `${(user1user2D/i)**(1/2)},${i}`
    }else{
        return null
    }
    
}

module.exports = {
    calcD
}