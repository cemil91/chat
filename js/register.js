import {getAuth,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";
const db = getDatabase();
const auth = getAuth();
$(document).ready(function () {
  

    $(document).on('submit', '#register', function (e) {

        swal("Loading", {
            buttons: false,
            timer: 20000,
            icon: "img/load.gif"
          });
        e.preventDefault();
        let firstname = $("input[name='firstname']").val();
        let lastname = $("input[name='lastname']").val();
        let email = $("input[name='email']").val();
        let password = $("input[name='password']").val();


        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                set(ref(db, 'users/' + user.uid), {
                    firstname: firstname,
                    lastname: lastname,
                    email: email
                  })
                  .then(() => {
                    swal("Tamamlandi!", "Qeyd oldunuz", "success");
                  })
                  .catch((error) => {
                    swal("Xəta!", error.code, "warning");
                  });
            })
            .catch((error) => {
                swal("Xəta!", error.code, "warning");
                
            });
    });

});