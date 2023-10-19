const router = require("express").Router();

router.get('/get-students', async (req, res) => {
    try {
        const response = await fetch(
            "https://ap-south-1.aws.data.mongodb-api.com/app/data-esbgx/endpoint/data/v1/action/find",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apiKey: "GCXGtTwS46OOUhnwYP622IB3bVfopWYRCCQDREO1MVZ2xE9Fmoh8MEEphpgV2MA0",
              },
              body: JSON.stringify({
                dataSource: "Cluster0",
                database: "sms",
                collection: "students",
              }),
            }
        );
        const data = await response.json();
        return res.status(200).json(data.documents);
    } catch (error) {
        console.log(error)
    }
})

router.post('/add-student', async (req, res) => {
    const {name, class_number, section, admission_number, gender, dob, address, phone_number, guardian_phone_number, subjects} = req.body;
    if(!name || !class_number || !section || !admission_number || !gender || !dob || !address || !phone_number || !guardian_phone_number || !subjects)
        return res.status(400).json({ error: "Please enter all the details" });
    if(name.length < 4 || name.length > 15)
        return res.status(400).json({ error: "Name can only be between than 4-25 characters." });
    if(address.length < 6)
        return res.status(400).json({ error: "Invalid address." });
    try {
        const checkIfStudentExists = await fetch(
            "https://ap-south-1.aws.data.mongodb-api.com/app/data-esbgx/endpoint/data/v1/action/findOne",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apiKey: "GCXGtTwS46OOUhnwYP622IB3bVfopWYRCCQDREO1MVZ2xE9Fmoh8MEEphpgV2MA0",
              },
              body: JSON.stringify({
                dataSource: "Cluster0",
                database: "sms",
                collection: "students",
                filter: {admission_number},
              }),
            }
        );
        const doesStudentExists = await checkIfStudentExists.json();
        if(doesStudentExists.document)
            return res.status(400).json({ error: "Student already exists." });

        const savingDoc = await fetch(
            "https://ap-south-1.aws.data.mongodb-api.com/app/data-esbgx/endpoint/data/v1/action/insertOne",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                apiKey: "GCXGtTwS46OOUhnwYP622IB3bVfopWYRCCQDREO1MVZ2xE9Fmoh8MEEphpgV2MA0",
                },
                body: JSON.stringify({
                dataSource: "Cluster0",
                database: "sms",
                collection: "students",
                document: { name, class_number, section, admission_number, gender, dob, address, phone_number, guardian_phone_number, subjects },
                }),
            }
            );
            const insertedID = await savingDoc.json();
            return res.status(201).json(insertedID.insertedId);

    } catch (error) {
        console.log(error)
    }
})

router.delete('/delete-student', async (req, res) => {
    const {admission_number} = req.body;
    if(!admission_number)
        return res.status(400).json({ error: "Please enter all the details" });

    try {
        const deleteStudent = await fetch(
            "https://ap-south-1.aws.data.mongodb-api.com/app/data-esbgx/endpoint/data/v1/action/deleteOne",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apiKey: "GCXGtTwS46OOUhnwYP622IB3bVfopWYRCCQDREO1MVZ2xE9Fmoh8MEEphpgV2MA0",
              },
              body: JSON.stringify({
                dataSource: "Cluster0",
                database: "sms",
                collection: "students",
                filter: {admission_number},
              }),
            }
        );
        const deletedStudent = await deleteStudent.json();
        if(!deletedStudent.deletedCount)
            return res.status(400).json({ error: "Delete failed!"});
        
        return res.status(200).json("Deleted successfully");
    } catch (error) {
        console.log(error)
    }
})

router.put('/update-student', async (req, res) => {
    const {name, class_number, section, admission_number, gender, dob, address, phone_number, guardian_phone_number, subjects} = req.body;
    if(!name || !class_number || !section || !admission_number || !gender || !dob || !address || !phone_number || !guardian_phone_number || !subjects)
        return res.status(400).json({ error: "Please enter all the details" });
    if(name.length < 4 || name.length > 15)
        return res.status(400).json({ error: "Name can only be between than 4-25 characters." });
    if(address.length < 6)
        return res.status(400).json({ error: "Invalid address." });

    try {
        const checkIfStudentExists = await fetch(
            "https://ap-south-1.aws.data.mongodb-api.com/app/data-esbgx/endpoint/data/v1/action/findOne",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apiKey: "GCXGtTwS46OOUhnwYP622IB3bVfopWYRCCQDREO1MVZ2xE9Fmoh8MEEphpgV2MA0",
              },
              body: JSON.stringify({
                dataSource: "Cluster0",
                database: "sms",
                collection: "students",
                filter: {admission_number},
              }),
            }
        );
        const doesStudentExists = await checkIfStudentExists.json();
        if(!doesStudentExists.document)
            return res.status(400).json({ error: "Student does not exists." });

        const updatingDoc = await fetch(
            "https://ap-south-1.aws.data.mongodb-api.com/app/data-esbgx/endpoint/data/v1/action/updateOne",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                apiKey: "GCXGtTwS46OOUhnwYP622IB3bVfopWYRCCQDREO1MVZ2xE9Fmoh8MEEphpgV2MA0",
                },
                body: JSON.stringify({
                dataSource: "Cluster0",
                database: "sms",
                collection: "students",
                filter: {admission_number},
                update: {
                    $set: {
                        name, class_number, section, admission_number, gender, dob, address, phone_number, guardian_phone_number, subjects
                    }
                }
            })});
            const updatedID = await updatingDoc.json();
            console.log(updatedID)
            if(!updatedID.modifiedCount)
                return res.status(400).json({ error: "Update failed!"});

            return res.status(200).json("Updated successfully");
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
