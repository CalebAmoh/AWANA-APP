const helper = require("./helper");
require("dotenv").config();


const addClubber = async (req,res) => {
    try  {
        const {firstname,middlename,lastname,level,dateOfBirth,gender,country,address,educationLevel,school
            ,fatherName,fatherOccupation,fatherContact,motherName,motherOccupation,motherContact,emergencyName,emergencyRelation
            ,emergencyContact,medicalConditions,allergies,medicalContact,awanaSupport,awanaSupportPeriod,supportContact,declaration
        } = req.body;

        //pass data entry into array
        const dataEntry = [
            { name: "First name", value: firstname },
            { name: "Last name", value: lastname },
            { name: "Club's Level", value: level },
            { name: "Date of Birth", value: dateOfBirth },
            { name: "Gender", value: gender },
            // { name: "Country", value: country },
            // { name: "Address", value: address }
        ];

        //check for null or empty values from data entry
        const result = helper.checkForNullOrEmpty(dataEntry);

        //check if clubber already exist
        const clubberName = {
            firstname: firstname,
            middlename: middlename,
            lastname: lastname
        }
        const clubberExist = await helper.selectRecordsWithConditionAnd('applicants',[{ firstname: firstname, middlename: middlename, lastname: lastname }],true);
        if(clubberExist.status === "success" && clubberExist.data.length > 0){
            return res.status(400).json({ result: "Clubber already exist", code: "400" });
        }

        if(result.status === "success"){

            const data = {
                firstname,
                middlename,
                lastname,
                level,
                dateOfBirth,
                gender,
                country,
                address,declaration,
                educationLevel,awanaSupport,awanaSupportPeriod,supportContact,
                school,emergencyContact,medicalConditions,allergies,medicalContact,
                fatherName,emergencyName,emergencyRelation,
                fatherOccupation,fatherContact,motherName,motherOccupation,motherContact
            }


            //insert data into the database
            const insertDoc = await helper.dynamicInsert('applicants', data);
            if(insertDoc.status === "success") {
                res.status(201).json({ result: "Clubber added successfully", code: "201" });
            }else{
                console.log("Error:",insertDoc.message);
                res.status(400).json({ result: insertDoc.message, code: "400" });
            }
        }else{
            res.status(400).json({ result: result.message, code: "400" });
        }

    }catch(error) {
        console.log("Unexpected error:",error);
        res.status(500).json({error:"Failed to generate document"})
    }
}

const getRegisteredClubbers = async (req, res) => {
	try {

            const query = `SELECT c.*, ag.name AS group_name FROM applicants c LEFT JOIN awana_groups ag ON c.level = ag.id ORDER BY c.id;`;
            clubbers = await helper.selectRecordsWithQuery(query);
            res.status(200).json({result:clubbers.data, code:"200"})
        

	} catch (error) {
	    console.error("Unexpected error: ", error);
	    res.status(500).json({ error: "An unexpected error occurred." });
	}
};

const addClubberScores = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging line
        const { clubber_id, credits, posted_by } = req.body;
        
        // Validation
        if (!clubber_id) {
            return res.status(400).json({
                success: false,
                message: "clubber_id and posted_by are required"
            });
        }
        
       
        
        const values = {
            clubber_id,
            dressing_credits: credits?.dressing || 0,
            attendance_credit: credits?.attendance || 0,
            punctuality_credit: credits?.punctuality || 0,
            handbook_credit: credits?.handbook || 0,
            assignment_credit: credits?.assignment || 0,
            invitation_credit: credits?.invitation || 0,
            academic_credit: credits?.academic || 0,
            game_time_credit: credits?.gametime || 0,
            // posted_by
        };
        
        const result = await helper.dynamicInsert('clubber_credit_scores', values);
        
        res.status(201).json({
            success: true,
            message: "Scores recorded successfully",
            data: {
                id: result.insertId,
                clubber_id: clubber_id
            }
        });
    } catch (error) {
        console.error("Error posting scores:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const upsertClubberScores = async (clubberId, scores, postedBy) => {
    try {
        const query = `
            INSERT INTO clubber_credit_scores (
                clubber_id,
                dressing_credits,
                attendance_credit,
                punctuality_credit,
                handbook_credit,
                assignment_credit,
                invitation_credit,
                academic_credit,
                game_time_credit,
                posted_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                dressing_credits = VALUES(dressing_credits),
                attendance_credit = VALUES(attendance_credit),
                punctuality_credit = VALUES(punctuality_credit),
                handbook_credit = VALUES(handbook_credit),
                assignment_credit = VALUES(assignment_credit),
                invitation_credit = VALUES(invitation_credit),
                academic_credit = VALUES(academic_credit),
                game_time_credit = VALUES(game_time_credit),
                posted_by = VALUES(posted_by)
        `;
        
        const values = [
            clubberId,
            scores.dressing_credits || 0,
            scores.attendance_credit || 0,
            scores.punctuality_credit || 0,
            scores.handbook_credit || 0,
            scores.assignment_credit || 0,
            scores.invitation_credit || 0,
            scores.academic_credit || 0,
            scores.game_time_credit || 0,
            postedBy
        ];
        
        const result = await db.query(query, values);
        
        return {
            success: true,
            message: result.affectedRows === 1 ? "Scores inserted" : "Scores updated"
        };
    } catch (error) {
        console.error("Error upserting scores:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

const insertBulkScores = async (scoresArray) => {
    try {
        const query = `
            INSERT INTO clubber_credit_scores (
                clubber_id,
                dressing_credits,
                attendance_credit,
                punctuality_credit,
                handbook_credit,
                assignment_credit,
                invitation_credit,
                academic_credit,
                game_time_credit,
                posted_by
            ) VALUES ?
        `;
        
        const values = scoresArray.map(item => [
            item.clubber_id,
            item.scores.dressing_credits || 0,
            item.scores.attendance_credit || 0,
            item.scores.punctuality_credit || 0,
            item.scores.handbook_credit || 0,
            item.scores.assignment_credit || 0,
            item.scores.invitation_credit || 0,
            item.scores.academic_credit || 0,
            item.scores.game_time_credit || 0,
            item.posted_by
        ]);
        
        const result = await db.query(query, [values]);
        
        return {
            success: true,
            insertedCount: result.affectedRows,
            message: "Bulk scores inserted successfully"
        };
    } catch (error) {
        console.error("Error inserting bulk scores:", error);
        return {
            success: false,
            message: "Failed to insert bulk scores",
            error: error.message
        };
    }
};

const getClubbersScoreTotals = async (req, res) => {
    try {
        const query = `
            SELECT 
                clubber_id,
                SUM(dressing_credits) AS total_dressing_credits,
                SUM(attendance_credit) AS total_attendance_credit,
                SUM(punctuality_credit) AS total_punctuality_credit,
                SUM(handbook_credit) AS total_handbook_credit,
                SUM(assignment_credit) AS total_assignment_credit,
                SUM(invitation_credit) AS total_invitation_credit,
                SUM(academic_credit) AS total_academic_credit,
                SUM(game_time_credit) AS total_game_time_credit
            FROM clubber_credit_scores 
            GROUP BY clubber_id
        `;
        
        const result = await helper.selectRecordsWithQuery(query);
        res.status(200).json({
            status: result.status,
            message: result.message,
            count: result.count || 0,
            data: result.data
        });
    } catch (error) {
        console.error("Error fetching clubber score totals:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch clubber score totals",
            error: error.message
        });
    }
};

const getAttendanceStats = async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(DISTINCT clubber_id) AS total_clubbers,
                AVG(attendance_credit) AS avg_attendance_credit,
                SUM(attendance_credit) AS total_attendance_credit
            FROM clubber_credit_scores
        `;
        
        const result = await helper.selectRecordsWithQuery(query);
        const data = result.data ? result.data[0] : { total_clubbers: 0, avg_attendance_credit: 0, total_attendance_credit: 0 };
        
        // Calculate attendance rate (assuming max attendance credit is 100 per clubber)
        const attendanceRate = data.total_clubbers > 0 
            ? Math.round((data.avg_attendance_credit / 100) * 100) 
            : 0;
        
        res.status(200).json({
            status: "success",
            message: "Attendance statistics retrieved",
            data: {
                attendanceRate: attendanceRate,
                totalClubbers: data.total_clubbers,
                averageAttendanceCredit: Math.round(data.avg_attendance_credit || 0),
                totalAttendanceCredit: Math.round(data.total_attendance_credit || 0)
            }
        });
    } catch (error) {
        console.error("Error fetching attendance stats:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch attendance statistics",
            error: error.message
        });
    }
};

const getAttendanceTrend = async (req, res) => {
    try {
        const query = `
            SELECT 
                WEEK(created_at) AS week,
                YEAR(created_at) AS year,
                COUNT(DISTINCT clubber_id) AS clubbers_with_attendance,
                AVG(attendance_credit) AS avg_attendance,
                SUM(attendance_credit) AS total_attendance
            FROM clubber_credit_scores
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
            GROUP BY YEAR(created_at), WEEK(created_at)
            ORDER BY YEAR(created_at) DESC, WEEK(created_at) DESC
        `;
        
        const result = await helper.selectRecordsWithQuery(query);
        const weeklyData = result.data || [];
        
        // Calculate current week vs previous week
        let currentWeekRate = 0;
        let previousWeekRate = 0;
        let isRising = false;
        let percentageChange = 0;
        
        if (weeklyData.length >= 2) {
            currentWeekRate = Math.round((weeklyData[0].avg_attendance / 100) * 100) || 0;
            previousWeekRate = Math.round((weeklyData[1].avg_attendance / 100) * 100) || 0;
            isRising = currentWeekRate > previousWeekRate;
            percentageChange = currentWeekRate - previousWeekRate;
        } else if (weeklyData.length === 1) {
            currentWeekRate = Math.round((weeklyData[0].avg_attendance / 100) * 100) || 0;
            isRising = true;
            percentageChange = 0;
        }
        
        res.status(200).json({
            status: "success",
            message: "Attendance trend retrieved",
            data: {
                currentWeekRate,
                previousWeekRate,
                isRising,
                percentageChange,
                weeklyTrend: weeklyData
            }
        });
    } catch (error) {
        console.error("Error fetching attendance trend:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch attendance trend",
            error: error.message
        });
    }
};

const getNewClubbers = async (req, res) => {
    try {
        // Get clubbers added in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        const query = `
            SELECT 
                COUNT(*) AS new_clubbers_month,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS new_clubbers_week,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS new_clubbers_today
            FROM applicants
            WHERE created_at >= ?
        `;
        
        const result = await helper.selectRecordsWithQuery(query, [formattedDate]);
        const data = result.data ? result.data[0] : { new_clubbers_month: 0, new_clubbers_week: 0, new_clubbers_today: 0 };
        
        res.status(200).json({
            status: "success",
            message: "New clubbers count retrieved",
            data: {
                newClubbersMonth: data.new_clubbers_month || 0,
                newClubbersWeek: data.new_clubbers_week || 0,
                newClubbersToday: data.new_clubbers_today || 0
            }
        });
    } catch (error) {
        console.error("Error fetching new clubbers:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch new clubbers count",
            error: error.message
        });
    }
};

const getClubbersNeedingHelp = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id,
                a.firstname,
                a.lastname,
                a.level,
                ag.name AS group_name,
                COALESCE(SUM(CASE WHEN ccs.attendance_credit > 0 THEN 1 ELSE 0 END), 0) AS attendance_count,
                COALESCE(SUM(ccs.attendance_credit), 0) AS total_attendance_credit,
                COALESCE(SUM(ccs.dressing_credits + ccs.attendance_credit + ccs.punctuality_credit + 
                    ccs.handbook_credit + ccs.assignment_credit + ccs.invitation_credit + 
                    ccs.academic_credit + ccs.game_time_credit), 0) AS total_credits,
                COUNT(DISTINCT ccs.id) AS total_records
            FROM applicants a
            LEFT JOIN clubber_credit_scores ccs ON a.id = ccs.clubber_id
            LEFT JOIN awana_groups ag ON a.level = ag.id
            GROUP BY a.id, a.firstname, a.lastname, a.level, ag.name
            HAVING total_credits < 50 OR total_attendance_credit < 5
            ORDER BY total_credits ASC
            LIMIT 10
        `;
        
        const result = await helper.selectRecordsWithQuery(query);
        
        res.status(200).json({
            status: "success",
            message: "Clubbers needing help retrieved",
            count: result.count || result.data.length || 0,
            data: result.data || []
        });
    } catch (error) {
        console.error("Error fetching clubbers needing help:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch clubbers needing help",
            error: error.message
        });
    }
};

module.exports = {
    getRegisteredClubbers,
    addClubberScores,
    getClubbersScoreTotals,
    getAttendanceStats,
    getAttendanceTrend,
    getNewClubbers,
    getClubbersNeedingHelp,
    addClubber
};