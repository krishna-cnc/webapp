'use strict';

/* Controllers */

// Form controller
app.controller('FormDemoCtrl', ['$scope','FileUploader','$http','NgMap','$timeout', function($scope,FileUploader,$http,NgMap,$timeout) {
    $scope.notBlackListed = function(value) {
        var blacklist = ['bad@domain.com','verybad@domain.com'];
        return blacklist.indexOf(value) === -1;
    }

    $scope._val_ = 1;
    /*$scope.val = parseFloat($('.tooltip-inner').text());*/
    $scope.$watch(function(){
        $scope.val = parseFloat($('.tooltip-inner').text());
    })
    var updateModel = function(val){
        $scope.$apply(function(){
            $scope.val = val;
        });
    };

    /*$scope.alertChange = function(data){
        console.log(data.value); // i can get slider value on slidestop

    }*/

    angular.element("#slider").on('slideStop', function(data){
        console.log(data.value)
        updateModel(data.value);
    });

    $scope.select2Number = [
        {text:'First',  value:'One'},
        {text:'Second', value:'Two'},
        {text:'Third',  value:'Three'}
    ];

    $scope.list_of_string = ['tag1', 'tag2']
    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': ['tag1', 'tag2', 'tag3', 'tag4']  // Can be empty list.
    };

    angular.element("#LinkInput").bind('click', function (event) {
        event.stopPropagation();
    });

    $scope.datePicker = function (start, end, label) {

    }



    var uploader = $scope.uploader = new FileUploader({
        url: 'js/controllers/upload.php'
    });


    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });





    /*var vm = this;
    vm.types = "['establishment']";
    vm.placeChanged = function() {
        vm.place = this.getPlace();
        console.log('location', vm.place.geometry.location);
        vm.map.setCenter(vm.place.geometry.location);
    }
    NgMap.getMap().then(function(map) {
        vm.map = map;
    });*/

    $scope.disableTap = function(){
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            console.log(0)
            document.getElementById('searchBar').blur();

        });
    };



    $(document).on('blur','#auto',function(){
        setTimeout(function(){
            var geocoder= new google.maps.Geocoder();
            geocoder.geocode( { "address": $('#auto').val() }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var location = results[0].geometry.location;
                    $scope.lat = location.lat()
                    $scope.long = location.lng()
                    $scope.$apply();
                }
            });
        },300)
    })


    $scope.getpos = function(event){
        $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
        $scope.lat = event.latLng.lat();
        $scope.long = event.latLng.lng();
    };

    var vm = this;
    $scope.reRednerMap = function(id) {
        setTimeout(function(){
            NgMap.getMap({id: 'barmap' }).then(function(map) {
                google.maps.event.trigger(map,'resize');
            });
            var options = {
                country: 'us'
            }

            var inputFrom = document.getElementById('auto');
            var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
        },1000)
    }
    /*$scope.reRednerMap = function(){

        NgMap.getMap('barmap').then(function(map) {
            console.log('NgMap.getMap in barCtrl', map);

        });
        google.maps.event.trigger('')
    }*/


    $scope.img_length;
    // CALLBACKS
    var img_name = []
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        //      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        //        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        setTimeout(function(){
            $scope.img_length = addedFileItems.length;
            if($scope.img_length >= 10)
            {
                console.info('Add Only 10 Images');
                $('.on_click').trigger('click');
            }
        })
    };
    uploader.onBeforeUploadItem = function(item) {
        //    console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        //  console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        //  console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //  console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        //    console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        //    console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        //    console.info('onCompleteItem', fileItem, response, status, headers);
        console.log(fileItem.file.name)
        img_name.push(fileItem.file.name)
    };
    uploader.onCompleteAll = function() {
        //    console.info('onCompleteAll');
    };

    //    console.info('uploader', uploader);


    var data = new FormData();
    $(document).on('submit', '#sent', function( e ){
        $.ajax( {
            url: "js/controllers/icons_upload.php",
            type:'POST',
            data: new FormData( this ),
            processData: false,
            contentType: false
        } );
        $(".file_upload").show();
        e.preventDefault();
    });


    /*$('').change(function(){
        console.log(0)
        if($(this).is('checked')){
            console.log($(this).val());
        }
    })*/
    $scope.img_no = 0;
    $(document).on('change','input.img_radio:radio',function(){
        $scope.img_no = $("input.img_radio:checked").val();
    });

    $(document).on('focus','#fomr_dates',function(){
        console.log(0)
        $('#fomr_dates').datetimepicker({
            format: 'YYYY/MM/DD',
            minDate:moment()
        });
    })
    var startDate
    $(document).on('focus','#to_date',function(){
        startDate = $('#fomr_dates').val();
        console.log(startDate)
        var  oneDayFromStartDate = moment(startDate).add(1, 'days').toDate();
        console.log(oneDayFromStartDate)
        $('#to_date').datetimepicker({
            format: 'YYYY/MM/DD',
            minDate:oneDayFromStartDate
        });
    })



    $scope.submitdata = function(name,city,state,address1,username,password,website,val,long,lat,h_dec,r_dec,zip,contact,fomr_date,to_date){
        var icon_l = document.getElementById("filestyle-0").files.length;
        console.log(img_name,img_name)
        if(img_name.length == 0 || icon_l == 0)
        {
            console.log(img_name,icon_l)
            $(".fil_img").show();
        }
        else{
            var icon = document.getElementById("filestyle-0").files[0].name;
            console.log($('.img_radio').length)
            console.log(name,city,state,address1,address1,username,website,val,long,lat,h_dec,r_dec,zip,contact)
            var hotel_am = [];
            var room_am = [];
            $('.hotel_am:checked').each(function(){
                hotel_am.push($(this).val());
                if($(this).attr('checked')) {
                } else {

                }
            })
            $('.room_am:checked').each(function(){
                room_am.push($(this).val());
                if($(this).attr('checked')) {

                } else {

                }
            })
            console.log(img_name[$scope.img_no])
            var listdata = new Date().getTime()
            firebase.auth().createUserWithEmailAndPassword(username, password).then(function(firebaseUser,$timeout) {
            }).then(function(){
                firebase.database().ref().child('hotel/'+listdata).set({
                    email:username,
                    Address1:address1,
                    Address2:address1,
                    City:city,
                    DisplayImage:img_name[$scope.img_no],
                    list_img:img_name,
                    Latitude:lat,
                    Longitude:long,
                    Name:name,
                    Phone:contact,
                    Rating:val,
                    hotel_am:hotel_am,
                    room_am:room_am,
                    State:state,
                    Zip:zip,
                    h_dec:h_dec,
                    r_dec:r_dec,
                    icons:document.getElementById("filestyle-0").files[0].name,
                    h_id:listdata,
                    archive:false,
                    fromdate :"",
                    todate :"",
                    threshold:100,
                })
                firebase.database().ref().child('admin/'+listdata).set({
                    hotel_id:listdata,
                    notify:true,
                    sound:true,
                    threshold:100,
                    email:username,
                    type:"admin"
                })
                firebase.database().ref().child('users/').push({
                    email:username,
                    type:"admin",
                    reg:false
                })
                alert('your account has been created');

            })
                .catch(function(error) {
                alert(error.message)
                firebase.database().ref().child('hotel/'+listdata).remove();
                return false;
            })
        }
    }
}]);


/*
new Date($('#fomr_dates').val()).getTime() / 1000
new Date($('#to_date').val()).getTime() / 1000
*/

