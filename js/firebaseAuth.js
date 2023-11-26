//  -------- Firebase inbuilt functions --------

// import '/firebase/database';

// Firebase Authenticator
var firebaseConfig = {

    apiKey: "AIzaSyB_xxibb13Usyfh9VbEHqnmmljyBukQnaw",
    authDomain: "atlantean-petal-397905.firebaseapp.com",
    databaseURL: "https://atlantean-petal-397905-default-rtdb.firebaseio.com",
    projectId: "atlantean-petal-397905",
    storageBucket: "atlantean-petal-397905.appspot.com",
    messagingSenderId: "975939013535",
    appId: "1:975939013535:web:3e5f65d642fd54944fcbaa",
    measurementId: "G-EQRW0GYSJK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//invokes firebase authentication.
const auth = firebase.auth();
// Initialize Firestore
const db = firebase.firestore();

// User loginstatus
var loginStatus = false;
// Page Status
var Page = window.location.pathname.split("/").pop().split(".")[0];
console.log("Page : ", Page);


// ========================== These are use to avoid NULL error in console ==========================
if (Page === "login") {

    //sign in when you hit enter
    document.querySelector("#login-password").addEventListener("keyup", (e) => {
        if (event.keyCode === 13) {
            e.preventDefault();
            login();
        }
    });
    // Login button
    document.querySelector("#login").addEventListener("click", () => {
        login();
    });
    // Forgot Password link
    document.querySelector("#forgot-password").addEventListener("click", () => {
        const email = document.querySelector("#login-email").value;
        if (email.trim() == "") {
            alert("Enter Email");
        } else {
            forgotPassword(email);
        }
    });
}
if (Page === "registration") {

    // Sign up button
    document.querySelector("#register").addEventListener("keyup", (e) => {
        register();
    });
    //register when you hit the enter key
    document.querySelector("#registration-password").addEventListener("keyup", (e) => {
        if (event.keyCode === 13) {
            e.preventDefault();
            register();
        }
    });
}
if (Page === "deviceRegistration") {
    document.querySelector("#device-registration").addEventListener("click", () => {
        deviceRegistration();
    });
    document.addEventListener("keyup", (e) => {
        if (event.keyCode === 13) {
            e.preventDefault();
            deviceRegistration();
        }
    });
}
if (Page === "editDevice") {
    document.querySelector("#edit-profile").addEventListener("click", () => {
        editDeviceDetails();
    });
    document.addEventListener("keyup", (e) => {
        if (event.keyCode === 13) {
            e.preventDefault();
            editDeviceDetails();
        }
    });
}
if (Page === "soilMoisture") {
    // Soil_moisture_page

    // Function to get and display the values
    var database = firebase.database();

    var dataRef = database.ref('sensorValue'); // Replace with your 'sensorValue' path

    var chartData = [];
    var timeLabels = [];

    var ctx = document.getElementById('realTimeChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Sensor Value',
                data: chartData,
                fill: true,

                borderColor: '#ADFF2F',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    dataRef.on('value', function (snapshot) {
        var sensorValue = snapshot.val();

        document.getElementById('tempValue').innerHTML = sensorValue + " &#8451;";
        document.getElementById('humiValue').innerHTML = sensorValue + "%";

        chartData.push(sensorValue); // Push sensor value data
        timeLabels.push(new Date().toLocaleTimeString()); // Push timestamp

        // Limit the number of data points shown
        const maxDataPoints = 10;
        if (chartData.length > maxDataPoints) {
            chartData.shift();
            timeLabels.shift();
        }

        myChart.update(); // Update the chart
    });

}
// ========================== --end ==========================





// ========================== Navbar EventListners ==========================

// Signout button
let logout = document.querySelectorAll(".logout-button");
for (let i = 0; i < logout.length; i++) {
    logout[i].addEventListener("click", () => {
        signOut();
    });
}
// Want to - Sign up button
let regCall = document.querySelectorAll(".registration-form-call");
for (let i = 0; i < regCall.length; i++) {
    regCall[i].addEventListener("click", () => {
        window.location.href = "registration.html";
    });
}
// Want to - sign in button
loginCall = document.querySelectorAll(".login-form-call");
for (let i = 0; i < loginCall.length; i++) {
    loginCall[i].addEventListener("click", () => {
        window.location.href = "login.html";
    });
}
// home page call button
let homeCall = document.querySelectorAll(".home-page-call");
for (let i = 0; i < homeCall.length; i++) {
    homeCall[i].addEventListener("click", () => {
        window.location.href = "./index.html";
    });

}




// ========================== Navbar EventListners --end ==========================





// ========================== Registration ==========================
const register = () => {
    const email = document.querySelector("#registration-email").value;
    const reemail = document.querySelector("#registration-reemail").value;
    const password = document.querySelector("#registration-password").value;

    if (email.trim() == "") {
        alert("Enter Email");
    } else if (password.trim().length < 7) {
        alert("Password must be at least 7 characters");
    } else if (email != reemail) {
        alert("emails do not match");
    } else {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                console.log("Registration successful:", userCredential);
                window.location.href = "./deviceRegistration.html"

            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error("Registration error:", errorCode, errorMessage);
                alert(errorMessage);
            });
    }
};
// ========================== Registration --end ==========================

// ========================== Login ==========================
const login = () => {
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    if (email.trim() == "") {
        alert("Enter Email");
    } else if (password.trim() == "") {
        alert("Enter Password");
    } else {
        authenticate(email, password);
    }
};
// ========================== Login --end ==========================

// ========================== Signout ==========================
const signOut = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            location.href = "./login.html";
        })
        .catch(function (error) {
            alert("error signing out, check network connection");
        });
};
// ========================== Signout --end ==========================

// ========================== Authentication ==========================
const authenticate = (email, password) => {
    const auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            console.log("Login successful:", userCredential);
            loginStatus = true;
            window.location.href = "./index.html";
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Login error:", errorCode, errorMessage);
            alert(errorMessage);
            if (errorMessage === "Firebase: Error (auth/invalid-login-credentials)."){
                window.location.href = "./registration.html";
            }
        });
};
// ========================== Authentication --end ==========================

// ========================== Forgot Password -- send reset_pass-email ==========================
const forgotPassword = (email) => {
    auth
        .sendPasswordResetEmail(email)
        .then(function () {
            alert("email sent");
        })
        .catch(function (error) {
            alert("invalid email or bad network connection");
        });
};
// ========================== Forgot Password -- send reset_pass-email --end ==========================

// ========================== successfull - Login ==========================
auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        console.log("User is signed in:", firebaseUser); // logging if user is authenticated
        loginStatus = true;  // setting login status to true 

        // populating edit device details forms with past details
        if (Page === "editDevice") {
            populateEditProfileForm();
        }

        // fetching and filling weather details
        if (Page === "climateCondition") {
            getAreaValue(function (areaValue) {
                searchByCityName(areaValue);
                // Use the areaValue in your other function here
            });
        }
        if (Page === "cropType") {
            getCropTypeValue(function (cropType) {
                if (cropType.value.toLowerCase() === "wheat") {
                    document.querySelector(".wheat").classList.remove("hide");
                } else if (cropType.valueowerCase() === "maize") {
                    document.querySelector(".maize").classList.remove("hide");
                } else {
                    document.querySelector(".wheat").classList.add("hide");
                    document.querySelector(".maize").classList.add("hide");
                }
            });
        }

        // allowing to go through different pages only if user is authenticated
        // Loop through the buttons and add event listeners
        let buttonClasses = {
            ".edit-device-details-call": "editDevice.html",
            ".soil-moisture-call": "soilMoisture.html",
            ".climate-condition-call": "climateCondition.html",
            ".water-use-call": "waterUse.html",
            ".crop-stge-call": "cropStage.html",
            ".time-period-call": "timePeriod.html",
            ".crop-type-call": "cropType.html",
            ".about-us-call": "aboutUs.html",
        };
        Object.entries(buttonClasses).forEach(([buttonClass, page]) => {
            let buttons = document.querySelectorAll(buttonClass);
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    window.location.href = page;
                });
            });
        });
    }
    else {
        console.log("User is not signed in.");  // logging if user is not authenticated
        loginStatus = false;


        // setting every button href to login page if user is not authenticated
        let buttonClasses = {
            ".edit-device-details-call": "editDevice.html",
            ".soil-moisture-call": "soilMoisture.html",
            ".climate-condition-call": "climateCondition.html",
            ".water-use-call": "waterUse.html",
            ".crop-stge-call": "cropStage.html",
            ".time-period-call": "timePeriod.html",
            ".crop-type-call": "cropType.html",
            ".about-us-call": "aboutUs.html",
        };
        Object.entries(buttonClasses).forEach(([buttonClass, page]) => {
            let buttons = document.querySelectorAll(buttonClass);
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    alert("Please login to continue.");
                    window.location.href = "./login.html";
                });
            });
        });
    }
    toggleLoginLogout();
});
// ========================== successfull - Login --end ==========================



//  ========================== Firebase inbuilt functions --end ==========================








// ========================== Toggle login/logout button ==========================
function toggleLoginLogout() {
    if (loginStatus) {
        let hide = document.querySelectorAll(".login-form-call, .registration-form-call");
        for (let i = 0; i < hide.length; i++) {
            hide[i].classList.add("hide");
        }
        let unhide = document.querySelectorAll(".logout-button");
        for (let i = 0; i < unhide.length; i++) {
            unhide[i].classList.remove("hide");
        }
    }
    else {
        let hide = document.querySelectorAll(".logout-button");
        for (let i = 0; i < hide.length; i++) {
            hide[i].classList.add("hide");
        }
        let unhide = document.querySelectorAll(".login-form-call, .registration-form-call");
        for (let i = 0; i < unhide.length; i++) {
            unhide[i].classList.remove("hide");
        }
    }
}
// ========================== Toggle login/logout button --end ==========================

// ========================== Input box background toggle ==========================
function checkInput() {
    // registration form
    if (Page === "registration") {
        ["registration-email", "registration-reemail", "registration-password"].forEach(id => {
            const editElement = document.getElementById(`${id}`);
            if (editElement.value !== "") {
                editElement.classList.add("input-active");
            }
            else {
                editElement.classList.remove("input-active");
            }
        });
    }
    // login form
    else if (Page === "login") {
        ["login-email", "login-password"].forEach(id => {
            const editElement = document.getElementById(`${id}`);
            if (editElement.value !== "") {
                editElement.classList.add("input-active");
            }
            else {
                editElement.classList.remove("input-active");
            }
        });
    }
    // device registration form
    else if (Page === "deviceRegistration") {
        ["device-id", "crop-state", "crop-type", "username"].forEach(id => {
            const editElement = document.getElementById(`${id}`);
            if (editElement.value !== "") {
                editElement.classList.add("input-active");
            }
            else {
                editElement.classList.remove("input-active");
            }
        });
    }
    // Edit profile form
    else if (Page === "editDevice") {
        ["device-id-edit", "crop-state-edit", "crop-type-edit", "username-edit"].forEach(id => {
            const editElement = document.getElementById(`${id}`);
            if (editElement.value !== "") {
                editElement.classList.add("input-active");
            }
            else {
                editElement.classList.remove("input-active");
            }
        });
    }
}
// ========================== Input box background toggle --end ==========================









// ========================== Devicde rehistration form ==========================
function deviceRegistration() {
    try {
        const deviceID = document.querySelector("#device-id").value;
        const area = document.querySelector("#area").value;
        const cropState = document.querySelector("#crop-state").value;
        const cropType = document.querySelector("#crop-type").value;
        const username = document.querySelector("#username").value;

        if (deviceID.trim() == "" || cropState.trim() == "" || cropType.trim() == "" || username.trim() == "") {
            throw new Error("All fields are required");
        }

        const user = firebase.auth().currentUser;

        if (!user) {
            throw new Error("User not authenticated. Please sign in.");
        }

        const userDocRef = db.collection("users").doc(user.uid);

        userDocRef.set({
            deviceID: deviceID,
            area: area,
            cropState: cropState,
            cropType: cropType,
            username: username,
        }).then(() => {
            alert("Device registered successfully!");
            location.href = "./index.html";
        }).catch((error) => {
            console.error("Error adding document: ", error);
            alert("An error occurred while registering the device.");
        });
    }
    catch (error) {
        alert(error.message);
    }

}
// ========================== Devicde rehistration form --end ==========================

// ========================== Edit Device form ==========================
function editDeviceDetails() {
    try {
        const deviceID = document.querySelector("#device-id-edit").value;
        const area = document.querySelector("#area-edit").value;
        const cropState = document.querySelector("#crop-state-edit").value;
        const cropType = document.querySelector("#crop-type-edit").value;
        const username = document.querySelector("#username-edit").value;

        const user = firebase.auth().currentUser;

        if (!user) {
            throw new Error("User not authenticated. Please sign in.");
        }

        // Get a reference to the user's document in Firestore
        const userDocRef = db.collection("users").doc(user.uid);

        // Update the user's document with the new profile data
        userDocRef.set({
            deviceID: deviceID,
            area: area,
            cropState: cropState,
            cropType: cropType,
            username: username,
        }, { merge: true }).then(() => {
            alert("Profile updated successfully!");
            location.href = "./index.html";
        }).catch((error) => {
            console.error("Error updating document: ", error);
            alert("An error occurred while updating the profile.");
        });
    }
    catch (error) {
        console.error("Error updating profile: ", error);
        alert("An error occurred while updating the profile.");
    }
}
// ========================== Edit Device form ==========================

// ========================== Edit-profile-page Display existing values ==========================
function populateEditProfileForm() {
    const user = firebase.auth().currentUser;

    if (user) {
        // User is signed in, get a reference to the user's document in Firestore
        const userDocRef = db.collection("users").doc(user.uid);

        // Get the user's document
        userDocRef.get().then((doc) => {
            if (doc.exists) {
                // The document exists, you can read its data
                const data = doc.data();

                // Display the data in the form
                document.querySelector("#device-id-edit").value = data.deviceID || '';
                document.querySelector("#area-edit").value = data.area || '';
                document.querySelector("#crop-state-edit").value = data.cropState || '';
                document.querySelector("#crop-type-edit").value = data.cropType || '';
                document.querySelector("#username-edit").value = data.username || '';
                checkInput();
            } else {
                // The document does not exist
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        // No user is signed in.
        console.log("User not authenticated. Please sign in.");
    }
}
// ========================== Edit-profile-page Display existing values --end ==========================

// ========================== climate_condition_page ==========================

// get the city stored in database firestore
function getAreaValue(callback) {
    const user = firebase.auth().currentUser;

    if (user) {
        // User is signed in, get a reference to the user's document in Firestore
        const userDocRef = db.collection("users").doc(user.uid);

        // Get the user's document
        userDocRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    // The document exists, you can read its data
                    const data = doc.data();
                    var area = data.area;
                    const city = ["Jodhpur", "Rajsamand", "Udaipur"];

                    // Display the data in the form
                    let areaValue;
                    if (area === "Area A") {
                        areaValue = city[0];
                    } else if (area === "Area B") {
                        areaValue = city[1];
                    } else if (area === "Area C") {
                        areaValue = city[2];
                    } else {
                        console.log("Out of Bound");
                    }

                    callback(areaValue);
                } else {
                    // The document does not exist
                    console.log("No such document!");
                    alert("Please complete your profile first!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        // No user is signed in.
        console.log("User not authenticated. Please sign in.");
    }
}

// ========================== climate_condition_page --end ==========================
function getCropTypeValue(callback) {
    const user = firebase.auth().currentUser;

    if (user) {
        // User is signed in, get a reference to the user's document in Firestore
        const userDocRef = db.collection("users").doc(user.uid);

        // Get the user's document
        userDocRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    // The document exists, you can read its data
                    const data = doc.data();
                    var cropState = data.cropType;
                    console.log("crp :", cropType);
                    callback(cropType);
                } else {
                    // The document does not exist
                    console.log("No such document!");
                    alert("Please complete your profile first!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        // No user is signed in.
        console.log("User not authenticated. Please sign in.");
    }
}
