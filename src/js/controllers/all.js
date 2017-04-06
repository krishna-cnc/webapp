app.controller('logout',function($scope,$state){
    $scope.logout = function(){
        window.localStorage.clear();
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
            $state.go('app.signin')
        }, function(error) {
            console.error('Sign Out Error', error);
        });
    }

    $scope.reset_pass = function(){
        var  r_email = window.localStorage.getItem('email');
        var auth = firebase.auth();
        $scope.reset = function(){
            auth.sendPasswordResetEmail(r_email).then(function() {
            }, function(error) {
                alert(error)
            });
        }   
    }
})
app.controller('tab_data',function($scope,$http,$timeout,$state){
    $scope.filteredTodos
        ,$scope.currentPage = 1
        ,$scope.numPerPage = 10
        ,$scope.maxSize = 5;


    firebase.database().ref().child('hotel/').on('value',function(data){
        $scope.pg_list = data.numChildren()
        console.log($scope.currentPage)
        var dt = data.val()
        $scope.new_data= []
        $scope.nav = $scope.new_data.length
        for(var x in dt)
        {
            $scope.new_data.push(dt[x]);
        }
        $scope.$watch('currentPage + numPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;
            console.log(begin,end)
            $scope.filteredTodos = $scope.new_data.slice(begin,end)
        });

        if($scope.currentPage == 1)
            $scope.$apply();
    })

    $scope.$watch(function(){
        $scope.fil_val
    })

    $(document).on('click','.hot_del',function(){
        var id = $(this).attr('id');
        firebase.database().ref().child('hotel/'+id).update({
            archive:true
        })    
    })
    $(document).on('click','.dis_btn',function(){
        var id = $(this).attr('data-id_d');
        firebase.database().ref().child('hotel/'+id).update({
            disable:true
        })    
    })

    /*$(document).on('click','a[data-id]',function(){
        console.log($(this).attr('data-id'))
        $state.go('app.report');
    })*/


});
app.controller('update_info',function($scope,$location){
    var hotel_id = $location.search().hotel
    console.log(hotel_id)
    $scope.hotel_id = $location.search().hotel
    firebase.database().ref().child('admin').on('value',function(data){
        $scope.hotel_sec = data.val()
    })
    firebase.database().ref().child('hotel/'+hotel_id).on('value',function(data){
        $scope.detail = data.val();
        $scope.img_list = $scope.detail.list_img
        $scope.hotel_am = $scope.detail.hotel_am
        $scope.room_am = $scope.detail.room_am
        var _length_ = $scope.hotel_am.length;
        $('.hotel_am input[type="checkbox"]').each(function(){
            for(var i=0;i<=_length_;i++)
            {
                if($(this).val() == $scope.hotel_am[i])
                {
                    $(this).prop('checked',true)
                }
            }
        })
        var _length  = $scope.detail.room_am.length
        $('.room_am input[type="checkbox"]').each(function(){
            for(var i=0;i<=_length;i++)
            {
                if($(this).val() == $scope.room_am[i])
                {
                    $(this).prop('checked',true)
                }
            }
        })


        $scope.$apply();
    })
    var name,city,add,phone,lat,log,rating,state,zip,from,to,d_img,r_dec,h_dec;
    $('[data-toggle="tooltip"]').tooltip();

    $(document).on('focus','#from_date .editable-input',function(){
        $('#from_date .editable-input').datetimepicker({
            format: 'YYYY/MM/DD',
            minDate:moment()
        });
    })
    var startDate
    $(document).on('focus','#to_date .editable-input',function(){
        startDate = $('#from_date .editable-input').val();
        console.log(startDate)
        var  oneDayFromStartDate = moment(startDate).add(1, 'days').toDate();
        console.log(oneDayFromStartDate)
        $('#to_date .editable-input').datetimepicker({
            format: 'YYYY/MM/DD',
            minDate:oneDayFromStartDate
        });
    })

    /*$('#from_date .editable-input').change(function(){
        form = new Date($(this).val()).getTime() / 1000
        console.log(form)
    })*/

    $(document).on('change','.hotel_am .ament_list input[type="checkbox"]',function(){
        $('.hotel_am .ament_list .btn-default').addClass('active');
        if($('.hotel_am .ament_list input[type="checkbox"]:checked').length <= 0)
        {
            $('.hotel_am .ament_list .btn-default').removeClass('active');
        }
    })
    $(document).on('change','.room_am .ament_list input[type="checkbox"]',function(){
        $('.room_am .ament_list .btn-default').addClass('active');
        if($('.room_am .ament_list input[type="checkbox"]:checked').length <= 0)
        {
            $('.room_am .ament_list .btn-default').removeClass('active');
        }
    })




    $scope.$watch(function(){
        name = $('#name').text()
        city = $('#city').text()
        add = $('#add').text()
        phone = $('#phone').text()
        lat = $('#lat').text()
        log = $('#log').text()
        rating = $('#rating').text()
        state = $('#state').text()
        zip = $('#zip').text();
        from = new Date($('#from_date .editable-input').val()).getTime() / 1000
        to = new Date($('#to_date .editable-input').val()).getTime() / 1000
        r_dec = $('#r_dec').text()
        h_dec = $('#h_dec').text()
    })

    $(document).on('click','.show_tab',function(){
        $('#from_date .editable-input').val($('#from').text())
        $('#to_date .editable-input').val($('#to').text())
    })


    $('.hotel_am .save_btn').click(function(){
        var _x_ = [];
        $('.hotel_am input[type="checkbox"]:checked').each(function(){
            _x_.push($(this).val())
        })
        firebase.database().ref().child('hotel/'+hotel_id).update({
            hotel_am:_x_
        })
        alert('Hotel Amenities is Updated')

    })
    $('.room_am .save_btn').click(function(){
        var _x_ = [];
        $('.room_am input[type="checkbox"]:checked').each(function(){
            _x_.push($(this).val())
        })
        firebase.database().ref().child('hotel/'+hotel_id).update({
            room_am:_x_
        })
        alert('Room Amenities is Updated')

    })

    d_img  = $('.img_detail .del_img #0').val()
    $(document).on('change','.img_detail .del_img input[type="radio"]',function(){
        var id = $(this).attr('id')
        d_img = $('.img_detail .del_img #'+id).val()
    })
    $(document).on('click','#update',function(){

        if(d_img == undefined || d_img == 'undefined')
        {
            d_img  = $('.img_detail .del_img #0').val();
        }
        firebase.database().ref().child('hotel/'+hotel_id).update({
            fromdate:from,
            todate:to
        })
        setTimeout(function(){
            console.log(name,city,add,phone,lat,log,rating,state)
            firebase.database().ref().child('hotel/'+hotel_id).update({
                Name: name,
                City: city,
                Address1: add,
                Phone: phone,
                Latitude: lat,
                Longitude: log,
                Rating: rating,
                state: state,
                Zip:zip,
                DisplayImage:d_img,
                h_dec:h_dec,
                r_dec:r_dec
            })

        },1000)
    })


    firebase.database().ref().child('track').on('value',function(data){
        var z = data.val();
        $scope.filt_list = [];
        for(var x in z)
        {
            $scope.filt_list.push(z[x]);
        }
        $scope.$apply();
    })

    var auth = firebase.auth();
    $scope.reset = function(email){
        auth.sendPasswordResetEmail(email).then(function() {
        }, function(error) {
            console.log(error)
        });
    }
    $(document).on('click','.col_2 .close',function(){
        if(hotel_id == $location.search().hotel){
            var _i_ = $(this).parent().index();
            var new_list = []
            firebase.database().ref().child('hotel/'+hotel_id+'/list_img/'+_i_).remove();
            firebase.database().ref().child('hotel/'+hotel_id+'/list_img').on('value',function(data){
                var img  = data.val();
                for(var x in img)
                {
                    new_list.push(img[x])
                }
            })
            firebase.database().ref().child('hotel/'+hotel_id+'/list_img').set(new_list);
            new_list = [];
            $scope.$apply();
        }
    })
    var img_list = []


    /*$(document).on('submit', '#sent', function( e ){
        e.preventDefault();
    });*/

    $scope.$watch(function(){
        if($('.del_img').length >= 10)
        {
            $('#upload_btn').prop("disabled",true);
            $('#myModal .close').trigger('click');
        }
    })

    $(document).on('click','.reset_pass',function(){
        $(this).prop("disabled",true);

    })
    var img_list = [];
    var data = new FormData();
    $(document).on('submit', '#sent', function( e ){
        $.ajax( {
            url: "js/controllers/hote_upload.php",
            type:'POST',
            data: new FormData( this ),
            processData: false,
            contentType: false
        } );
        var _x_;
        setTimeout(function(){
            $('.img_detail .del_img').each(function(){
                _x_ = $(this).children('img').attr('src').split('/');
                _x_ = _x_[_x_.length - 1];
                console.log(0)
                img_list.push(_x_)
            })
            img_list.push(document.getElementById("fileToUpload").files[0].name)
            setTimeout(function(){
                if(hotel_id == $location.search().hotel){
                    firebase.database().ref().child('hotel/'+hotel_id+'/list_img').set(img_list);
                    img_list = [];
                }
            },250)
            setTimeout(function(){
                window.location.reload();
            },1000)
            e.preventDefault();
        },200)
        /*firebase.database().ref().child('hotel/'+hotel_id+'/list_img').on('child_changed',function(data){
            var img  = data.val();
            for(var x in img)
            {
                img_list.push(img[x])
            }
            img_list.push(document.getElementById("fileToUpload").files[0].name)
        })
        firebase.database().ref().child('hotel/'+hotel_id+'/list_img').set(img_list);
        img_list = [];
        $scope.$apply();
        e.preventDefault();*/
    });

})

app.controller('fag_pass',function($scope){
    var  r_email = window.localStorage.getItem('email') 
    $scope.fag_password = function(){
        var auth = firebase.auth();
        $scope.reset = function(email){
            auth.sendPasswordResetEmail(email).then(function() {
            }, function(error) {
                alert(error)
            });
        }   
    }
})

app.controller('nother_admin',function($scope,$location){
    $(document).on('click','.create_admin',function(){
        if($('#add_admin input').val() != ""){
            if($('#another_password').val() == $('#another_repeat').val()){
                var email = $('#another_admin').val();
                var pass = $('#another_password').val();
                var threshold_ ;
                firebase.database().ref().child('admin/'+$location.search().hotel).on('value',function(data){
                    var _z_ = data.val()
                    threshold_ = _z_.threshold
                })
                firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(){
                    var new_date = new Date().getTime();
                    firebase.database().ref().child('admin/'+new_date).set({
                        email:$('#another_admin').val(),
                        hotel_id:$location.search().hotel,
                        notify:true,
                        sound:true,
                        type:'admin',
                        threshold:threshold_
                    })
                    firebase.database().ref().child('users/').push({
                        email:$('#another_admin').val(),
                        type:"admin",
                        reg:false
                    })
                    alert('Your Another Account Created')
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if(error.message == "The email address is already in use by another account."){
                        var new_date = new Date().getTime();
                        firebase.database().ref().child('admin/'+new_date).set({
                            email:$('#another_admin').val(),
                            hotel_id:$location.search().hotel,
                            notify:true,
                            sound:true,
                            type:'admin',
                            threshold:threshold_
                        })
                        alert("Now "+$('#another_admin').val()+" also register as admin")
                    }
                    else{
                        alert(error.message)
                    }
                }); 
            }
            else{
                alert("Password Not Match")
            }
        }
        else{
            alert("Field Can't be Empty")
        }
    })  
    $(document).on('click','.new_admin',function(){
        $('#add_admin').addClass('active');
    })


    $(document).on('click','.close_popup',function(){
        $('#add_admin').removeClass('active')
    })
})


app.controller('report',function($scope,$location){

    var maxPoints = new Array();
    var scoreByPattern = []
    firebase.database().ref().child('search_city/').once('value',function(data){
        var _res_ = data.val()
        for(var x  in _res_){
            scoreByPattern.push({
                city:x,
                count:_res_[x].count
            })
            /*console.log(x,_res_[x].count)*/
        }

        console.log(scoreByPattern)
        $scope.list_sec = scoreByPattern;
        $scope.$apply()
    })

    var now = new Date();
    now.setDate(now.getDate() - 7); // add -7 days to your date variable
    $scope.prev_date = Math.round(new Date(now).getTime());


    var _month_ = new Date();
    _month_.setDate(_month_.getDate() - 30);
    $scope.month = Math.round(new Date(_month_).getTime());

    var d = new Date();
    d.setHours(d.getHours() - 1);
    $scope.hourly = Math.round(new Date(d).getTime());

    var _query_ = new Date();
    _query_.setDate(_month_.getDate() - 90);
    $scope.query = Math.round(new Date(_query_).getTime());

    var _d_ = new Date();
    _d_.setHours(_d_.getHours() - 24);
    $scope.daily = Math.round(new Date(_d_).getTime());


    /**/
    get_data($scope.prev_date)
    /**/
    $(document).on('change','.report_select',function(){
        var $this = $(this).val()
        if($this == 'Weekly'){
            get_data($scope.prev_date)
        }
        if($this == 'Hourly')
        {
            get_data($scope.hourly)
        }
        if($this == 'Daily')
        {
            get_data($scope.daily)
        }
        if($this == 'Quarterly')
        {
            get_data($scope.query)
        }
        if($this == 'Monthly'){
            get_data($scope.month)
        }
    })

    function get_data(x){
        $scope.id =  $location.search().list
        $scope.$watch(function(){
            $scope.id = $location.search().list;
        })
        firebase.database().ref().child('track').on('value',function(data){
            var _i_ = 0;
            var _j_ = 0;
            var _z_ = 0;
            var _t_ = 0;
            var _amo_ = 0;
            var _miss_ = 0;
            $scope.list = data.val();
            for(var _x_  in $scope.list){
                if($scope.list[_x_].sub_date >= x){
                    if($scope.id == $scope.list[_x_].hotel_id)
                    {
                        if($scope.list[_x_].sub_date != "-" && $scope.list[_x_].sub_date != "Pending"){
                            _i_ ++;
                        }
                        if($scope.list[_x_].accept != "-" && $scope.list[_x_].accept != "Pending"){
                            _j_ ++;
                        }
                        if($scope.list[_x_].reject != "-" && $scope.list[_x_].reject != "Pending" && $scope.list[_x_].reject != ""){
                            _z_++;
                        }
                        if($scope.list[_x_].timeout != "-" && $scope.list[_x_].timeout != "Pending" && $scope.list[_x_].timeout != ""){
                            _t_++;
                        }
                        if($scope.list[_x_].ammount != "-" && $scope.list[_x_].ammount != "Pending" && $scope.list[_x_].ammount != ""){
                            _amo_ = _amo_ + $scope.list[_x_].ammount
                        }
                    }
                }
                if($scope.list[_x_].reject == "-" || $scope.list[_x_].reject == ""){
                    _miss_ = _miss_ + $scope.list[_x_].ammount
                }
            }
            setTimeout(function(){
                $scope.totle_ammount = _i_;
                $scope.accepted = _j_;
                $scope.rejected = _z_;
                $scope.timeout = _t_;
                $scope._amo_ = _amo_;
                $scope._miss_ = _miss_;
                $scope.$apply()
            },1000)
            $scope.$apply()
        })
    }

    firebase.database().ref().child('hotel').once('value',function(data){
        $scope.hotel_s = data.val();
    })
    firebase.database().ref().child('select_count').once('value',function(data){
        $scope.select_count = data.val()
    })

})

app.controller('main_report',function($scope,$location){

    var maxPoints = new Array();
    var scoreByPattern = []
    firebase.database().ref().child('search_city/').once('value',function(data){
        var _res_ = data.val()
        for(var x  in _res_){
            scoreByPattern.push({
                city:x,
                count:_res_[x].count
            })
            /*console.log(x,_res_[x].count)*/
        }

        console.log(scoreByPattern)
        $scope.list_sec = scoreByPattern;
        $scope.$apply()
    })


    var now = new Date();
    now.setDate(now.getDate() - 7); // add -7 days to your date variable
    $scope.prev_date = Math.round(new Date(now).getTime());


    var _month_ = new Date();
    _month_.setDate(_month_.getDate() - 30);
    $scope.month = Math.round(new Date(_month_).getTime());
    /*$scope.id = $location.search().list;*/

    var _query_ = new Date();
    _query_.setDate(_month_.getDate() - 90);
    $scope.query = Math.round(new Date(_query_).getTime());

    var d = new Date();
    d.setHours(d.getHours() - 1);
    $scope.hourly = Math.round(new Date(d).getTime());

    var _d_ = new Date();
    _d_.setHours(_d_.getHours() - 24);
    $scope.daily = Math.round(new Date(_d_).getTime());

    /**/
    get_data($scope.prev_date)
    /**/
    $(document).on('change','.report_select',function(){
        var $this = $(this).val()
        if($this == 'Weekly'){
            get_data($scope.prev_date)
        }
        if($this == 'Hourly')
        {
            get_data($scope.hourly)
        }
        if($this == 'Daily')
        {
            get_data($scope.daily)
        }
        if($this == 'Quarterly')
        {
            get_data($scope.query)
        }
        else{
            get_data($scope.month)
        }
    })

    function get_data(x){
        firebase.database().ref().child('track').on('value',function(data){
            var _i_ = 0;
            var _j_ = 0;
            var _z_ = 0;
            var _t_ = 0;
            var _amo_ = 0;
            var _miss_ = 0;
            $scope.list = data.val();
            for(var _x_  in $scope.list){
                if($scope.list[_x_].sub_date >= x){
                    /*if($scope.id == $scope.list[_x_].hotel_id)
                    {*/
                    if($scope.list[_x_].sub_date != "-" && $scope.list[_x_].sub_date != "Pending"){
                        _i_ ++;
                    }
                    if($scope.list[_x_].accept != "-" && $scope.list[_x_].accept != "Pending"){
                        _j_ ++;
                    }
                    if($scope.list[_x_].reject != "-" && $scope.list[_x_].reject != "Pending" && $scope.list[_x_].reject != ""){
                        _z_++;
                    }
                    if($scope.list[_x_].timeout != "-" && $scope.list[_x_].timeout != "Pending" && $scope.list[_x_].timeout != ""){
                        _t_++;
                    }
                    if($scope.list[_x_].ammount != "-" && $scope.list[_x_].ammount != "Pending" && $scope.list[_x_].ammount != ""){
                        _amo_ = _amo_ + $scope.list[_x_].ammount
                    }
                    /*}*/
                }
                if($scope.list[_x_].reject == "-" || $scope.list[_x_].reject == ""){
                    _miss_ = _miss_ + $scope.list[_x_].ammount
                }
            }
            $scope.$watch(function(){
                $scope.totle_ammount = _i_;
                $scope.accepted = _j_;
                $scope.rejected = _z_;
                $scope.timeout = _t_;
                $scope._amo_ = _amo_;
                $scope._miss_ = _miss_;
            })
            $scope.$apply()
        })
    }
})