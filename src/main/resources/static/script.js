// =====================================================
// GLOBAL VARIABLES
// =====================================================

let selectedBusId = null;
let selectedBusNumber = null;
let selectedBusRoute = null;

let scanner = null;
let approvalStudentId = null;
let currentReportData = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("Bus Attendance System loaded");

    displayCurrentDate();
    createApprovalModal();
    setDefaultReportDate();
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

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        currentDate.innerText =
            date.toLocaleDateString("en-IN", options);
    }
}


// =====================================================
// DEFAULT REPORT DATE
// =====================================================

function setDefaultReportDate() {
    const reportDate = document.getElementById("reportDate");

    if (reportDate) {
        reportDate.value = new Date()
            .toISOString()
            .split("T")[0];
    }
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
    const input = document.getElementById("busNumberInput");
    const busNumber = input.value.trim();
    const error = document.getElementById("busError");

    error.innerText = "";

    if (busNumber === "") {
        error.innerText = "Please enter a bus number.";
        return;
    }

    if (Number(busNumber) <= 0) {
        error.innerText =
            "Bus number must be greater than 0.";
        return;
    }

    fetch("/buses")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load buses");
            }

            return response.json();
        })

        .then(buses => {
            console.log("Buses:", buses);

            const bus = buses.find(
                b =>
                    Number(b.busNumber) === Number(busNumber)
            );

            if (!bus) {
                error.innerText =
                    "Bus " + busNumber +
                    " was not found in the database.";

                document.getElementById(
                    "attendanceSection"
                ).style.display = "none";

                return;
            }

            selectedBusId = bus.id;
            selectedBusNumber = bus.busNumber;
            selectedBusRoute = bus.route;

            document.getElementById(
                "attendanceSection"
            ).style.display = "block";

            document.getElementById(
                "busTitle"
            ).innerText = "Bus " + bus.busNumber;

            document.getElementById(
                "busRoute"
            ).innerText =
                bus.route || "Route not available";

            // Load attendance summary
            loadAttendance(selectedBusId);

            // Load present students
            displayPresentStudents(selectedBusId);

            currentReportData = null;

            const reportResult = document.getElementById(
                "reportResult"
            );

            if (reportResult) {
                reportResult.style.display = "none";
            }

            const reportMessage = document.getElementById(
                "reportMessage"
            );

            if (reportMessage) {
                reportMessage.innerText = "";
            }

            document.getElementById(
                "attendanceSection"
            ).scrollIntoView({
                behavior: "smooth"
            });
        })

        .catch(errorObject => {
            console.error(errorObject);

            error.innerText =
                "Unable to connect to the server.";
        });
}


// =====================================================
// LOAD TODAY'S ATTENDANCE
// =====================================================

function loadAttendance(busId) {
    fetch("/attendance/bus/" + busId)

        .then(response => {
            if (!response.ok) {
                throw new Error(
                    "Unable to load attendance"
                );
            }

            return response.json();
        })

        .then(data => {
            console.log("Attendance:", data);

            document.getElementById(
                "totalStudents"
            ).innerText = data.totalStudents;

            document.getElementById(
                "presentStudents"
            ).innerText = data.presentStudents;

            document.getElementById(
                "absentStudents"
            ).innerText = data.absentStudents;

            document.getElementById(
                "absentBadge"
            ).innerText =
                data.absentStudents + " Absent";

            let percentage = 0;

            if (data.totalStudents > 0) {
                percentage = Math.round(
                    (
                        data.presentStudents /
                        data.totalStudents
                    ) * 100
                );
            }

            document.getElementById(
                "attendancePercentage"
            ).innerText = percentage + "%";

            document.getElementById(
                "progressFill"
            ).style.width = percentage + "%";

            const list = document.getElementById(
                "absenteeList"
            );

            list.innerHTML = "";

            if (
                !data.absentees ||
                data.absentees.length === 0
            ) {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td colspan="4"
                        style="
                            text-align:center;
                            color:#16a34a;
                            padding:25px;
                            font-weight:600;
                        ">
                        ✓ All students are present
                    </td>
                `;

                list.appendChild(row);
                return;
            }

            data.absentees.forEach((student, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index + 1}</td>

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
            });
        })

        .catch(errorObject => {
            console.error(errorObject);

            const scanResult = document.getElementById(
                "scanResult"
            );

            if (scanResult) {
                scanResult.innerText =
                    "Unable to load attendance.";
            }
        });
}


// =====================================================
// DISPLAY PRESENT STUDENTS
// =====================================================

async function displayPresentStudents(busId) {
    try {
        const response = await fetch(
            `/attendance/bus/${busId}/present`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch present students"
            );
        }

        const students = await response.json();

        console.log(
            "Present students:",
            students
        );

        const tableBody = document.getElementById(
            "presentStudentsTable"
        );

        const presentCount = document.getElementById(
            "presentCount"
        );

        if (!tableBody || !presentCount) {
            console.error(
                "Present student HTML elements not found"
            );

            return;
        }

        presentCount.textContent =
            `${students.length} Present`;

        tableBody.innerHTML = "";

        if (
            !students ||
            students.length === 0
        ) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="text-align:center;">
                        No students present yet.
                    </td>
                </tr>
            `;

            return;
        }

        students.forEach((student, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    ${student.rollNumber || "N/A"}
                </td>

                <td>
                    ${student.studentName || "N/A"}
                </td>

                <td>
                    <span class="present-status">
                        PRESENT
                    </span>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (errorObject) {
        console.error(
            "Error loading present students:",
            errorObject
        );

        const tableBody = document.getElementById(
            "presentStudentsTable"
        );

        const presentCount = document.getElementById(
            "presentCount"
        );

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="text-align:center;">
                        Unable to load attendance.
                    </td>
                </tr>
            `;
        }

        if (presentCount) {
            presentCount.textContent = "0 Present";
        }
    }
}


// =====================================================
// START BARCODE SCANNER
// =====================================================

function startScanner() {
    if (selectedBusId === null) {
        alert("Please select a bus first.");
        return;
    }

    if (typeof Html5Qrcode === "undefined") {
        alert("Scanner library could not be loaded.");
        return;
    }

    if (scanner) {
        stopScanner();
    }

    document.getElementById("reader").innerHTML = "";

    document.getElementById(
        "scanResult"
    ).innerText = "Starting camera...";

    scanner = new Html5Qrcode("reader");

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

        decodedText => {
            console.log("Scanned:", decodedText);

            document.getElementById(
                "scanResult"
            ).innerText =
                "Scanned ID: " + decodedText;

            stopScanner();

            markAttendance(decodedText);
        },

        errorMessage => {
            // Ignore continuous scanner errors
        }
    )

        .catch(errorObject => {
            console.error(errorObject);

            document.getElementById(
                "scanResult"
            ).innerText = "";

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

        .catch(errorObject => {
            console.error(
                "Scanner stop error:",
                errorObject
            );

            scanner = null;
        });
}


// =====================================================
// MANUAL ATTENDANCE
// =====================================================

function manualAttendance() {
    if (selectedBusId === null) {
        alert("Please select a bus first.");
        return;
    }

    const input = document.getElementById(
        "manualStudentId"
    );

    const studentId = input.value.trim();

    if (studentId === "") {
        alert("Please enter student roll number.");
        return;
    }

    markAttendance(studentId);

    input.value = "";
}


// =====================================================
// MARK ATTENDANCE
// =====================================================

function markAttendance(studentId) {
    if (selectedBusId === null) {
        return;
    }

    const scanResult = document.getElementById(
        "scanResult"
    );

    scanResult.innerText = "Checking student...";
    scanResult.style.color = "#3264e8";

    fetch(
        "/attendance/check" +
        "?studentId=" +
        encodeURIComponent(studentId) +
        "&busId=" +
        selectedBusId,

        {
            method: "POST"
        }
    )

        .then(response => {
            return response.json()
                .then(data => ({
                    status: response.status,
                    data: data
                }));
        })

        .then(result => {
            console.log(
                "Attendance check result:",
                result
            );

            const data = result.data;

            if (
                result.status >= 200 &&
                result.status < 300 &&
                data.status === "PRESENT"
            ) {
                showScanSuccess(
                    data.studentName || studentId
                );

                // Refresh summary
                loadAttendance(selectedBusId);

                // Refresh present students
                displayPresentStudents(selectedBusId);

                return;
            }

            if (
                result.status >= 200 &&
                result.status < 300 &&
                data.status === "APPROVAL_REQUIRED"
            ) {
                showApprovalModal(data);
                return;
            }

            const message =
                data.message ||
                "Unable to check attendance";

            showScanError(message);
        })

        .catch(errorObject => {
            console.error(errorObject);

            showScanError(
                "Server error while checking attendance."
            );
        });
}


// =====================================================
// SUCCESS MESSAGE
// =====================================================

function showScanSuccess(studentName) {
    const result = document.getElementById(
        "scanResult"
    );

    result.innerText =
        "✓ Attendance marked for " + studentName;

    result.style.color = "#16a34a";
    result.style.background = "#eafaf0";
    result.style.padding = "10px";
    result.style.borderRadius = "10px";

    setTimeout(() => {
        result.style.background = "transparent";
    }, 2500);
}


// =====================================================
// ERROR MESSAGE
// =====================================================

function showScanError(message) {
    const result = document.getElementById(
        "scanResult"
    );

    result.innerText = message;

    result.style.color = "#dc2626";
    result.style.background = "#fff1f1";
    result.style.padding = "10px";
    result.style.borderRadius = "10px";
}


// =====================================================
// CREATE APPROVAL MODAL
// =====================================================

function createApprovalModal() {
    if (document.getElementById("approvalModal")) {
        return;
    }

    const modal = document.createElement("div");

    modal.id = "approvalModal";

    modal.innerHTML = `
        <div class="approval-overlay">

            <div class="approval-box">

                <div class="approval-icon">
                    ⚠️
                </div>

                <h2>
                    Bus Assignment Notice
                </h2>

                <p
                    id="approvalMessage"
                    class="approval-message">
                </p>

                <div class="student-info">

                    <div>
                        <span>Student</span>

                        <strong
                            id="approvalStudentName">
                        </strong>
                    </div>

                    <div>
                        <span>Student ID</span>

                        <strong
                            id="approvalStudentId">
                        </strong>
                    </div>

                    <div>
                        <span>Assigned Bus</span>

                        <strong
                            id="approvalAssignedBus">
                        </strong>
                    </div>

                    <div>
                        <span>Current Bus</span>

                        <strong
                            id="approvalCurrentBus">
                        </strong>
                    </div>

                </div>

                <p class="approval-question">
                    Allow this student to travel
                    on the current bus?
                </p>

                <div class="approval-buttons">

                    <button
                        id="denyButton"
                        class="deny-button"
                        onclick="denyAttendance()">

                        Deny

                    </button>

                    <button
                        id="allowButton"
                        class="allow-button"
                        onclick="allowAttendance()">

                        ✓ Allow

                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    addApprovalModalStyles();
}


// =====================================================
// SHOW APPROVAL MODAL
// =====================================================

function showApprovalModal(data) {
    approvalStudentId = data.studentId;

    document.getElementById(
        "approvalMessage"
    ).innerText =
        data.message || "Approval required.";

    document.getElementById(
        "approvalStudentName"
    ).innerText =
        data.studentName || "Unknown";

    document.getElementById(
        "approvalStudentId"
    ).innerText =
        data.studentId || "Unknown";

    document.getElementById(
        "approvalAssignedBus"
    ).innerText =
        data.assignedBusId === null
            ? "Not assigned"
            : "Bus " + data.assignedBusId;

    document.getElementById(
        "approvalCurrentBus"
    ).innerText =
        "Bus " + data.currentBusId;

    document.getElementById(
        "approvalModal"
    ).style.display = "flex";
}


// =====================================================
// ALLOW ATTENDANCE
// =====================================================

function allowAttendance() {
    if (approvalStudentId === null) {
        return;
    }

    const allowButton = document.getElementById(
        "allowButton"
    );

    const denyButton = document.getElementById(
        "denyButton"
    );

    allowButton.disabled = true;
    denyButton.disabled = true;

    allowButton.innerText = "Allowing...";

    fetch(
        "/attendance/allow" +
        "?studentId=" +
        encodeURIComponent(approvalStudentId) +
        "&busId=" +
        selectedBusId,

        {
            method: "POST"
        }
    )

        .then(response => {
            return response.json()
                .then(data => ({
                    status: response.status,
                    data: data
                }));
        })

        .then(result => {
            console.log(
                "Allow result:",
                result
            );

            if (
                result.status >= 200 &&
                result.status < 300
            ) {
                closeApprovalModal();

                showScanSuccess(
                    result.data.student?.name ||
                    approvalStudentId
                );

                // Refresh summary
                loadAttendance(selectedBusId);

                // Refresh present students
                displayPresentStudents(selectedBusId);
            } else {
                const message =
                    result.data.message ||
                    "Unable to allow attendance.";

                closeApprovalModal();

                showScanError(message);
            }
        })

        .catch(errorObject => {
            console.error(errorObject);

            closeApprovalModal();

            showScanError(
                "Server error while allowing attendance."
            );
        });
}


// =====================================================
// DENY ATTENDANCE
// =====================================================

function denyAttendance() {
    console.log(
        "Attendance denied for:",
        approvalStudentId
    );

    closeApprovalModal();

    const result = document.getElementById(
        "scanResult"
    );

    result.innerText = "Attendance denied.";

    result.style.color = "#dc2626";
    result.style.background = "#fff1f1";
    result.style.padding = "10px";
    result.style.borderRadius = "10px";

    setTimeout(() => {
        result.style.background = "transparent";
    }, 2500);

    approvalStudentId = null;
}


// =====================================================
// CLOSE APPROVAL MODAL
// =====================================================

function closeApprovalModal() {
    const modal = document.getElementById(
        "approvalModal"
    );

    if (modal) {
        modal.style.display = "none";
    }

    approvalStudentId = null;
}


// =====================================================
// APPROVAL MODAL STYLES
// =====================================================

function addApprovalModalStyles() {
    const style = document.createElement("style");

    style.innerHTML = `
        #approvalModal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 9999;
        }

        .approval-overlay {
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.65);
            backdrop-filter: blur(5px);

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;
        }

        .approval-box {
            width: 100%;
            max-width: 460px;

            background: white;
            border-radius: 22px;
            padding: 30px;

            text-align: center;

            box-shadow:
                0 25px 70px
                rgba(0, 0, 0, 0.25);

            animation:
                approvalPopup
                0.25s ease;
        }

        .approval-icon {
            width: 58px;
            height: 58px;

            margin: 0 auto 15px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;
            background: #fff7e6;

            font-size: 27px;
        }

        .approval-box h2 {
            font-size: 21px;
            color: #172033;
            margin-bottom: 10px;
        }

        .approval-message {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .student-info {
            background: #f7f8fa;
            border: 1px solid #edf0f4;
            border-radius: 14px;

            padding: 15px;
            text-align: left;

            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .student-info div {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .student-info span {
            font-size: 10px;
            color: #8992a3;

            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .student-info strong {
            font-size: 13px;
            color: #172033;
        }

        .approval-question {
            margin: 20px 0;

            font-size: 14px;
            font-weight: 600;
            color: #374151;
        }

        .approval-buttons {
            display: flex;
            gap: 12px;
        }

        .approval-buttons button {
            flex: 1;

            height: 48px;
            border: none;
            border-radius: 11px;

            font-size: 14px;
            font-weight: 700;

            cursor: pointer;
            transition: 0.2s;
        }

        .deny-button {
            background: #fff1f1;
            color: #dc2626;

            border: 1px solid #fecaca !important;
        }

        .deny-button:hover {
            background: #fee2e2;
            transform: translateY(-1px);
        }

        .allow-button {
            background:
                linear-gradient(
                    135deg,
                    #16a34a,
                    #22c55e
                );

            color: white;

            box-shadow:
                0 7px 18px
                rgba(22, 163, 74, 0.20);
        }

        .allow-button:hover {
            transform: translateY(-1px);

            box-shadow:
                0 10px 22px
                rgba(22, 163, 74, 0.28);
        }

        .approval-buttons button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
            transform: none;
        }

        @keyframes approvalPopup {
            from {
                opacity: 0;
                transform:
                    translateY(15px)
                    scale(0.97);
            }

            to {
                opacity: 1;
                transform:
                    translateY(0)
                    scale(1);
            }
        }

        @media (max-width: 500px) {
            .approval-box {
                padding: 22px;
            }

            .student-info {
                grid-template-columns: 1fr;
            }

            .approval-buttons {
                flex-direction: column-reverse;
            }
        }
    `;

    document.head.appendChild(style);
}

// =====================================================
// ATTENDANCE REPORT
// =====================================================


// =====================================================
// LOAD ATTENDANCE REPORT
// =====================================================

function loadAttendanceReport() {

    // Check selected bus
    if (selectedBusId === null) {
        alert("Please select a bus first.");
        return;
    }

    const dateInput = document.getElementById(
        "reportDate"
    );

    const selectedDate = dateInput.value;

    const message = document.getElementById(
        "reportMessage"
    );

    const reportResult = document.getElementById(
        "reportResult"
    );

    // Validate date
    if (selectedDate === "") {
        message.innerText =
            "Please select a date.";

        message.style.color = "#dc2626";

        reportResult.style.display = "none";

        return;
    }

    // Loading message
    message.innerText =
        "Loading attendance report...";

    message.style.color = "#3264e8";

    reportResult.style.display = "none";

    // =================================================
    // CALL DATE API
    // =================================================

    fetch(
        "/attendance/bus/" +
        selectedBusId +
        "/date?date=" +
        encodeURIComponent(selectedDate)
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Unable to load attendance report."
                );
            }

            return response.json();
        })

        .then(data => {

            console.log(
                "Attendance Report:",
                data
            );

            currentReportData = data;

            // =================================================
            // NO ATTENDANCE
            // =================================================

            if (
                data.attendanceRecorded === false
            ) {

                message.innerText =
                    data.message ||
                    "No attendance recorded for this date.";

                message.style.color = "#d97706";

                reportResult.style.display = "none";

                return;
            }

            // =================================================
            // ATTENDANCE EXISTS
            // =================================================

            message.innerText =
                "Attendance report loaded successfully.";

            message.style.color = "#16a34a";

            reportResult.style.display = "block";

            // =================================================
            // DATE
            // =================================================

            document.getElementById(
                "reportSelectedDate"
            ).innerText =
                formatReportDate(selectedDate);

            // =================================================
            // STATISTICS
            // =================================================

            document.getElementById(
                "reportTotalStudents"
            ).innerText =
                data.totalStudents;

            document.getElementById(
                "reportPresentStudents"
            ).innerText =
                data.presentStudents;

            document.getElementById(
                "reportAbsentStudents"
            ).innerText =
                data.absentStudents;

            // =================================================
            // ABSENTEE TABLE
            // =================================================

            const list = document.getElementById(
                "reportAbsenteeList"
            );

            list.innerHTML = "";

            if (
                !data.absentees ||
                data.absentees.length === 0
            ) {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td
                        colspan="4"
                        style="
                            text-align:center;
                            color:#16a34a;
                            padding:25px;
                            font-weight:600;
                        "
                    >
                        ✓ All students were present
                    </td>
                `;

                list.appendChild(row);

                return;
            }

            // Add absent students
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

            currentReportData = null;

            message.innerText =
                "Unable to load attendance report.";

            message.style.color = "#dc2626";

            reportResult.style.display = "none";
        });
}


// =====================================================
// FORMAT REPORT DATE
// =====================================================

function formatReportDate(dateString) {

    const date = new Date(
        dateString + "T00:00:00"
    );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// =====================================================
// DOWNLOAD ATTENDANCE REPORT
// =====================================================

function downloadAttendanceReport() {

    // Check report
    if (currentReportData === null) {

        alert(
            "Please view an attendance report first."
        );

        return;
    }

    // Check attendance
    if (
        currentReportData.attendanceRecorded === false
    ) {

        alert(
            "There is no attendance recorded for this date."
        );

        return;
    }

    const data = currentReportData;

    const selectedDate =
        document.getElementById(
            "reportDate"
        ).value;

    // =================================================
    // CREATE CSV ROWS
    // =================================================

    const rows = [];

    rows.push([
        "College Bus Attendance Report"
    ]);

    rows.push([
        "Bus Number",
        selectedBusNumber
    ]);

    rows.push([
        "Route",
        selectedBusRoute || "N/A"
    ]);

    rows.push([
        "Date",
        formatReportDate(selectedDate)
    ]);

    rows.push([]);

    rows.push([
        "Total Students",
        data.totalStudents
    ]);

    rows.push([
        "Present Students",
        data.presentStudents
    ]);

    rows.push([
        "Absent Students",
        data.absentStudents
    ]);

    rows.push([]);

    rows.push([
        "#",
        "Roll Number",
        "Student Name",
        "Status"
    ]);

    // =================================================
    // ABSENT STUDENTS
    // =================================================

    if (
        data.absentees &&
        data.absentees.length > 0
    ) {

        data.absentees.forEach(
            (student, index) => {

                rows.push([
                    index + 1,
                    student.studentId,
                    student.name,
                    "ABSENT"
                ]);
            }
        );

    } else {

        rows.push([
            "",
            "",
            "All students were present",
            "PRESENT"
        ]);
    }

    // =================================================
    // CONVERT TO CSV
    // =================================================

    const csvContent =
        rows
            .map(row =>
                row
                    .map(value =>
                        `"${String(
                            value ?? ""
                        ).replace(
                            /"/g,
                            '""'
                        )}"`
                    )
                    .join(",")
            )
            .join("\n");

    // =================================================
    // CREATE FILE
    // =================================================

    const blob = new Blob(
        [
            "\uFEFF" + csvContent
        ],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        "Bus_" +
        selectedBusNumber +
        "_Attendance_" +
        selectedDate +
        ".csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}