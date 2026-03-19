export function parseStudentEmail(email) {
    const username = email.split("@")[0];

    const year = 2000 + parseInt(username.slice(0, 2));
    const batch = `${year}-${year + 4}`;

    const deptCode = username.slice(2, 4).toLowerCase();

    const deptMap = {
        cs: "CSE",
        cy: "CSE Cyber Security",
        ce: "Civil Engineering",
        me: "Mechanical Engineering",
        ec: "Electronics",
        ee: "Electrical",
    };

    return {
        batch,
        department: deptMap[deptCode] || "Unknown",
    };
}