import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    onValue,
    update,
    get,
    push,
    set,
    query,
    orderByChild,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

const auth = getAuth();
const db = getDatabase();


var user_id = 0;
var my_id = 0;
var check1 = "";
var check2 = "";
var refcheck3 = "";
var last_msg = "";


var ChatosExamle = {
    Message: {
        add: function (message, type) {
            var chat_body = $('.layout .content .chat .chat-body');
            if (chat_body.length > 0) {

                type = type ? type : '';
                message = message ? message : 'Lorem ipsum dolor sit amet.';

                $('.layout .content .chat .chat-body .messages').append('<div class="message-item ' + type + '"><div class="message-content">' + message + '</div><div class="message-action">PM 14:25 ' + (type ? '<i class="ti-check"></i>' : '') + '</div></div>');

                chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                    cursorcolor: 'rgba(66, 66, 66, 0.20)',
                    cursorwidth: "4px",
                    cursorborder: '0px'
                }).resize();
            }
        }
    }
};
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;

        onValue(ref(db, `notifications/${uid}`), async(sp) => {
            const notf = sp.val();
            setTimeout(() => {
                $(".chats-list").empty();
            }, 1000);
            
            
            $.each(notf, async function(i,item){
               const notf_users = (await get(ref(db, 'users/'+i))).val();
               const count = Object.keys(item).length;
               const last_msg_id = Object.keys(item)[count-1];
                
               get(ref(db, 'messages/' + uid + '_' + i)).then(async(x)=>
                {
                    if(x.exists()) { last_msg = await get(ref(db, 'messages/' + uid + '_' + i+'/'+last_msg_id));  }
                });

               get(ref(db, 'messages/' + i + '_' + uid)).then(async(x)=>
                {
                    if(x.exists()) { last_msg = await get(ref(db, 'messages/' + i + '_' + uid+'/'+last_msg_id)); }
                });

                setTimeout(async() => {
                    
                    $(".chats-list").append(`
                    <li uid="${i}" class="list-group-item xsx">
                    <figure class="avatar avatar-state-success">
                    <img src="./dist/media/img/man_avatar1.jpg" class="rounded-circle">
                    </figure>
                    <div class="users-list-body">
                    <h5>${notf_users.firstname} ${notf_users.lastname}</h5>
                    <p>${last_msg.val().message}</p>
                    <div class="users-list-action">
                    <div class="new-message-count">${count}</div>
                    </div>
                    </div>
                    </li>
                `);
                }, 1000);
                



            });
            const user_msgss = await get_user_messages(my_id, user_id);
            $('.layout .content .chat .chat-body .messages').empty();
            $.each(user_msgss, function (i, item) {
                ChatosExamle.Message.add(item.message);
            });


        });

        
        ///user list
        onValue(ref(db, 'users'), (snapshot) => {
            const data = snapshot.val();
            $(".ulsearch").empty();
            $.each(data, function (i, item) {
                $(".ulsearch").append(`<li uid="${i}" class="list-group-item">
                                    <div>
                                    <figure class="avatar">
                                        <span class="avatar-title bg-success rounded-circle">${item.firstname.charAt(0)}</span>
                                    </figure>
                                    </div>
                                    <div class="users-list-body">
                                        <h5>${item.firstname} ${item.lastname}</h5>
                                        <p>${item.about}</p>
                                        <div class="users-list-action">
                                            <div class="dropdown">
                                                <a data-toggle="dropdown" href="#">
                                                    <i class="ti-more"></i>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <a href="#" class="dropdown-item">Open</a>
                                                    <a href="#" data-navigation-target="contact-information" class="dropdown-item">Profile</a>
                                                    <a href="#" class="dropdown-item">Add to archive</a>
                                                    <a href="#" class="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>`);
            });

        });
        ///user list end

        $(document).on('click', '#profile_save', function () {
            $("#about_form").submit();
        });
        $(document).on('submit', '#about_form', function (e) {
            e.preventDefault();
            let about_text = $("textarea[name='about-text']").val();
            about_save(about_text);
        });

        $(document).on('click', '.ulsearch li, .chats-list li', async function () {
            let thiss = $(this);
            let uidd = thiss.attr('uid');

            $('.layout .content .chat .chat-body .messages').empty();
            const user_inf = await get_user_info(uidd);
            $("#username").html(user_inf.firstname + ' ' + user_inf.lastname);
            user_id = uidd;
            my_id = uid;

            const user_msgs = await get_user_messages(my_id, user_id);
            $('.layout .content .chat .chat-body .messages').empty();
            $.each(user_msgs, function (i, item) {
                ChatosExamle.Message.add(item.message);
            });
            





        });


        function about_save(message) {
            update(ref(db, 'users/' + uid), {
                    about: message

                }).then((data) => console.log("ok"))
                .catch((error) => console.log("xeta"));
        }

        async function get_user_info(uid) {
            return (await get(ref(db, 'users/' + uid))).val();
        }
        async function get_user_messages(my_id, user_id) {
            check1 = await get(ref(db, 'messages/' + my_id + '_' + user_id));
            check2 = await get(ref(db, 'messages/' + user_id + '_' + my_id));

            if (check1.exists()) refcheck3 = 'messages/' + my_id + '_' + user_id;
            else
            if (check2.exists()) refcheck3 = 'messages/' + user_id + '_' + my_id;
            else
                refcheck3 = "";
            return (await get(query(ref(db, refcheck3), orderByChild("time")))).val();
        }




    } else {
        location.href = "login.html";
    }
});



$(document).ready(function () {




    $(document).on('submit', '.layout .content .chat .chat-footer form', async function (e) {
        e.preventDefault();

        var input = $(this).find('input[type=text]');
        var message = input.val();

        message = $.trim(message);

        if (message) {
            ChatosExamle.Message.add(message, 'outgoing-message');
            input.val('');

            const msg = ref(db, 'messages');
            const ref_msg = push(msg).key;


            if (check1.exists() == false && check2.exists() == false) {
                set(ref(db, 'messages/' + my_id + '_' + user_id + '/' + ref_msg), {
                    time: new Date().getTime(),
                    message: message,
                    read: 0,
                    sender_id: my_id
                }).then(async (x) => {
                    set(ref(db, 'notifications/' + user_id + '/' + my_id + '/' + ref_msg), {
                        sender_id: my_id
                    });
                    check1 = await get(ref(db, 'messages/' + my_id + '_' + user_id));
                    check2 = await get(ref(db, 'messages/' + user_id + '_' + my_id));

                });
            }

            if (check1.exists()) {
                refcheck3 = 'messages/' + my_id + '_' + user_id;
            } else
            if (check2.exists()) {
                refcheck3 = 'messages/' + user_id + '_' + my_id;
            } else {
                refcheck3 = "";
            }

            if (refcheck3 != "") {
                set(ref(db, refcheck3 + '/' + ref_msg), {
                    time: new Date().getTime(),
                    message: message,
                    read: 0,
                    sender_id: my_id
                });

                set(ref(db, 'notifications/' + user_id + '/' + my_id + '/' + ref_msg), {
                    sender_id: my_id
                });
            }




        } else {
            input.focus();
        }
    });

    $(document).on('click', '.layout .content .sidebar-group .sidebar .list-group-item', function () {
        if (jQuery.browser.mobile) {
            $(this).closest('.sidebar-group').removeClass('mobile-open');
        }
    });





    $("#searchinput").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $(".ulsearch li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});