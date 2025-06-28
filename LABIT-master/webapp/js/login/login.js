$(".reg-input").each( function( i ){
    $(".reg-input").eq(i).on("propertychange change paste input", function (e){
        $(".reg-input").eq(i).css("border-color", "");
    });
});


function closeModal(){
    $('.modal').hide();
}

function registMember() {

    let passRule =/^[A-Za-z0-9]{6,12}$/;
    var emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    $(".reg-input").each( function (index, item){
        const inputValue = $(item).val();
        if( inputValue == null || inputValue === ""){
            $(item).css("border-color", "red");
            $(item).addClass("error_vibe");
            $(item).focus();

            setTimeout( function() {
                $(item).removeClass("error_vibe");
            }, 400);

            return false;
        }else{
            const target = $(item).attr("id");
            if( target === "reg-email"){
                if(
                    !emailRule.test( $(item).val() )
                ){
                    $(item).css("border-color", "red");
                    $(item).addClass("error_vibe");
                    $(item).focus();

                    setTimeout( function() {
                        $(item).removeClass("error_vibe");
                    }, 400);

                    document.querySelector("#modal-text").innerText ="이메일 형식이 아닙니다.";
                    $('.modal').show();

                    return false;
                }
            }else if(target === "reg-idpassword"){
                if(
                    !passRule.test($(item).val())
                ){
                    $(item).css("border-color", "red");
                    $(item).addClass("error_vibe");
                    $(item).focus();

                    setTimeout( function() {
                        $(item).removeClass("error_vibe");
                    }, 400);

                    document.querySelector("#modal-text").innerText ="패스워드는 숫자와 문자를 포함한 형태의 6 ~ 12 자리 입니다.";
                    $('.modal').show();

                    return false;
                }
            }

        }
    });


    let registData ={};
    registData["form"] = $('form[name="registForm"]').serializeObject();

    let authCode = $("#reg-auth-email").val().trim();

    if(authCode == "" || authCode == 0){

        $.ajax({
            url : 'authMail.act',
            async : true,
            type : "post",
            dataType : 'html',
            contentType : "application/json; charset=UTF-8",
            data : JSON.stringify(registData),
            success : function (responseData, textStatus){
                var resp = JSON.parse(responseData);

                if(resp.code== "SU") {
                    document.querySelector("#modal-text").innerText ="메일로 인증코드가 전송되었습니다.";
                    $('.modal').show();
                }
            },
            error : function (request, status, error ){
             },
             beforeSend : function (){

             }
        });
    }else{
        goRegist(registData);
    }

};

function goRegist(registData){

    $.ajax({
        url : 'registMember.act',
        async : true,
        type : "post",
        dataType : 'html',
        contentType : "application/json; charset=UTF-8",
        data : JSON.stringify(registData),
        success : function (responseData, textStatus){
            var resp = JSON.parse(responseData);

            if(resp.result== "SUCCESS") {
                document.querySelector("#modal-text").innerText ="환영합니다 회원가입이 완료되었습니다.";
                $('.modal').show();

                chgTap();

            }
            else if(resp.result == "FAIL"){
                document.querySelector("#modal-text").innerText ="오류.";
                $('.modal').show();

                chgTap();
            }

        },
        error : function (request, status, error ){

        },
        beforeSend : function (){

        }
    });
}