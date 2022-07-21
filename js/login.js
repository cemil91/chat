import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

const auth = getAuth();


$(document).ready(function() {

    $(document).on('submit','#login_form',function(e) {
        e.preventDefault();
        swal("Loading", {
            buttons: false,
            timer: 20000,
            icon: "img/load.gif"
          });

        let email = $("input[name='email']").val();
        let password = $("input[name='password']").val();

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          swal("Tamamlandi!", "Daxil oldunuz", "success");
          window.location.href="index.html";
        })
        .catch((error) => {
            swal("Xəta!", error.code, "warning");
        });
    
    });

});
