exports.index = (req, res) => {
    let totalAmount = 0; 
    let cartList = {}; 
    //쿠키가 있는지 확인해서 뷰로 넘겨준다
    if(typeof(req.cookies.cartList) !== 'undefined'){
        cartList = JSON.parse(unescape(req.cookies.cartList));

        //총가격을 더해서 전달해준다.
        for(const key in cartList){
            totalAmount += parseInt(cartList[key].amount);
        }
    }

    res.render('cart/index.html', { cartList, totalAmount } );
};