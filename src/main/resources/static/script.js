// =====================================================
// GLOBAL VARIABLES
// =====================================================

let selectedBusId = null;
let selectedBusNumber = null;
let selectedBusRoute = null;

let scanner = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Bus Attendance System loaded");

    displayCurrentDate();

});


// =====================================================
// CURRENT DATE
// =====================================================

function displayCurrentDate() {

    const date = new Date();

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };

    document.getElementById("currentDate").innerText =
        date.toLocaleDateString("en-IN", options);
}


// =====================================================
// PRESS ENTER
// =====================================================

function handleEnter(event) {

    if (event.key === "Enter") {

        selectBus();

    }

}


// =====================================================
// SELECT BUS
// =====================================================

function selectBus() {

    const input =
        document.getElementById("busNumberInput");

    const busNumber =
        input.value.trim();

    const error =
        document.getElementById("busError");


    error.innerText = "";


    // Validate input

    if (busNumber === "") {

        error.innerText =
            "Please enter a bus number.";

        return;

    }


    if (Number(busNumber) <= 0) {

        error.innerText =
            "Bus number must be greater than 0.";

        return;

    }


    // Get buses from backend

    fetch("/buses")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load buses"
                );

            }

            return response.json();

        })


        .then(buses => {

            console.log("Buses:", buses);


            // Find entered bus

            const bus = buses.find(
                b =>
                    Number(b.busNumber)
                    ===
                    Number(busNumber)
            );


            // Bus doesn't exist

            if (!bus) {

                error.innerText =
                    "Bus " + busNumber +
                    " was not found in the database.";

                document.getElementById(
                    "attendanceSection"
                ).style.display = "none";

                return;

            }


            // Store selected bus

            selectedBusId =
                bus.id;

            selectedBusNumber =
                bus.busNumber;

            selectedBusRoute =
                bus.route;


            // Display dashboard

            document.getElementById(
                "attendanceSection"
            ).style.display = "block";


            document.getElementById(
                "busTitle"
            ).innerText =
                "Bus " + bus.busNumber;


            document.getElementById(
                "busRoute"
            ).innerText =
                bus.route || "Route not available";


            // Load attendance

            loadAttendance(selectedBusId);


            // Scroll dashboard into view

            document.getElementById(
                "attendanceSection"
            ).scrollIntoView({
                behavior: "smooth"
            });

        })


        .catch(error => {

            console.error(error);

            error.innerText =
                "Unable to connect to the server.";

        });

}


// =====================================================
// LOAD ATTENDANCE
// =====================================================

function loadAttendance(busId) {

    fetch(
        "/attendance/bus/" + busId
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load attendance"
                );

            }

            return response.json();

        })


        .then(data => {

            console.log(
                "Attendance:",
                data
            );


            // ==========================
            // NUMBERS
            // ==========================

            document.getElementById(
                "totalStudents"
            ).innerText =
                data.totalStudents;


            document.getElementById(
                "presentStudents"
            ).innerText =
                data.presentStudents;


            document.getElementById(
                "absentStudents"
            ).innerText =
                data.absentStudents;


            // ==========================
            // ABSENT BADGE
            // ==========================

            document.getElementById(
                "absentBadge"
            ).innerText =
                data.absentStudents
                + " Absent";


            // ==========================
            // ATTENDANCE PERCENTAGE
            // ==========================

            let percentage = 0;


            if (data.totalStudents > 0) {

                percentage =
                    Math.round(
                        (
                            data.presentStudents
                            /
                            data.totalStudents
                        ) * 100
                    );

            }


            document.getElementById(
                "attendancePercentage"
            ).innerText =
                percentage + "%";


            document.getElementById(
                "progressFill"
            ).style.width =
                percentage + "%";


            // ==========================
            // ABSENTEE TABLE
            // ==========================

            const list =
                document.getElementById(
                    "absenteeList"
                );


            list.innerHTML = "";


            if (
                !data.absentees ||
                data.absentees.length === 0
            ) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td colspan="4"
                        style="text-align:center;
                        color:#16a34a;
                        padding:25px;">
                        ✓ All students are present
                    </td>
                `;


                list.appendChild(row);

                return;

            }


            data.absentees.forEach(
                (student, index) => {

                    const row =
                        document.createElement("tr");


                    row.innerHTML = `

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <strong>
                                ${student.studentId}
                            </strong>
                        </td>

                        <td>
                            ${student.name}
                        </td>

                        <td>
                            <span class="status">
                                ABSENT
                            </span>
                        </td>

                    `;


                    list.appendChild(row);

                }
            );

        })


        .catch(error => {

            console.error(error);

            document.getElementById(
                "scanResult"
            ).innerText =
                "Unable to load attendance.";

        });

}


// =====================================================
// START BARCODE SCANNER
// =====================================================

function startScanner() {

    // Check bus

    if (selectedBusId === null) {

        alert(
            "Please select a bus first."
        );

        return;

    }


    // Check library

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        alert(
            "Scanner library could not be loaded."
        );

        return;

    }


    // Stop previous scanner

    if (scanner) {

        stopScanner();

    }


    document.getElementById(
        "reader"
    ).innerHTML = "";


    document.getElementById(
        "scanResult"
    ).innerText =
        "Starting camera...";


    scanner =
        new Html5Qrcode("reader");


    const config = {

        fps: 10,

        qrbox: {
            width: 300,
            height: 150
        },

        formatsToSupport: [

            Html5QrcodeSupportedFormats.CODE_128,

            Html5QrcodeSupportedFormats.EAN_13,

            Html5QrcodeSupportedFormats.EAN_8,

            Html5QrcodeSupportedFormats.UPC_A

        ]

    };


    scanner.start(

        {
            facingMode: "environment"
        },

        config,


        // ==========================
        // SUCCESS
        // ==========================

        decodedText => {

            console.log(
                "Scanned:",
                decodedText
            );


            document.getElementById(
                "scanResult"
            ).innerText =
                "Scanned ID: "
                + decodedText;


            stopScanner();


            markAttendance(
                decodedText
            );

        },


        // ==========================
        // SCAN FAILURE
        // ==========================

        errorMessage => {

            // Ignore continuous scan errors

        }

    )


        .catch(error => {

            console.error(error);


            document.getElementById(
                "scanResult"
            ).innerText =
                "";


            alert(
                "Unable to start camera. " +
                "Please allow camera permission."
            );

        });

}


// =====================================================
// STOP SCANNER
// =====================================================

function stopScanner() {

    if (!scanner) {

        return;

    }


    scanner.stop()

        .then(() => {

            scanner.clear();

            scanner = null;

        })

        .catch(error => {

            console.error(
                "Scanner stop error:",
                error
            );

            scanner = null;

        });

}


// =====================================================
// MANUAL ATTENDANCE
// =====================================================

function manualAttendance() {

    if (selectedBusId === null) {

        alert(
            "Please select a bus first."
        );

        return;

    }


    const input =
        document.getElementById(
            "manualStudentId"
        );


    const studentId =
        input.value.trim();


    if (studentId === "") {

        alert(
            "Please enter student roll number."
        );

        return;

    }


    markAttendance(
        studentId
    );


    input.value = "";

}


// =====================================================
// MARK ATTENDANCE
// =====================================================

function markAttendance(
    studentId
) {

    if (selectedBusId === null) {

        return;

    }


    document.getElementById(
        "scanResult"
    ).innerText =
        "Checking student...";


    fetch(

        "/attendance/mark"
        +
        "?studentId="
        +
        encodeURIComponent(studentId)
        +
        "&busId="
        +
        selectedBusId,

        {
            method: "POST"
        }

    )


        .then(response => {

            return response.json()

                .then(data => ({

                    status:
                    response.status,

                    data: data

                }));

        })


        .then(result => {

            console.log(
                "Attendance result:",
                result
            );


            // ==========================
            // SUCCESS
            // ==========================

            if (
                result.status >= 200
                &&
                result.status < 300
            ) {

                document.getElementById(
                    "scanResult"
                ).innerText =
                    "✓ Attendance marked for "
                    + studentId;


                document.getElementById(
                    "scanResult"
                ).style.color =
                    "#16a34a";


                // Refresh dashboard

                loadAttendance(
                    selectedBusId
                );

            }


                // ==========================
                // ERROR
            // ==========================

            else {

                const message =
                    result.data.message
                    ||
                    "Unable to mark attendance";


                document.getElementById(
                    "scanResult"
                ).innerText =
                    message;


                document.getElementById(
                    "scanResult"
                ).style.color =
                    "#dc2626";


                // Don't use alert every time.
                // Dashboard itself shows error.

                loadAttendance(
                    selectedBusId
                );

            }

        })


        .catch(error => {

            console.error(error);


            document.getElementById(
                "scanResult"
            ).innerText =
                "Server error while marking attendance.";


            document.getElementById(
                "scanResult"
            ).style.color =
                "#dc2626";

        });

}