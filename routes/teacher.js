const router = require("express").Router();
const bcrypt = require("bcryptjs");

router.get("/get-teachers", async (req, res) => {
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
                collection: "teachers",
              }),
            }
        );
        const data = await response.json();
        return res.status(200).json(data.documents);
    } catch (error) {
        
    }
})

router.get("/get-teachers", async (req, res) => {
    const { cnic } = req.body;

    const cnicReg =
    /^([0-9]{5})[\-]([0-9]{7})[\-]([0-9]{1})+/;

    if(!cnicReg.test(cnic))
        return res.status(400).json({ error: "Please enter a valid CNIC."});

    try {
        const response = await fetch(
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
                collection: "teachers",
                filter: {cnic}
              }),
            }
        );
        const data = await response.json();
        return res.status(200).json(data.documents);
    } catch (error) {
        
    }
})

router.post("/add-teacher", async (req, res) => {
    const {cnic, name, email, password, education, address, phone_number, faculty_id, salary, gender, designation, date_of_joining} = req.body;

    if(!cnic || !name || !email || !password ||!education || !address || !phone_number || !faculty_id || !salary || !gender || !designation || !date_of_joining)
        return res.status(400).json({ error: "Please enter all the details" });

    const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const cnicReg =
    /^([0-9]{5})[\-]([0-9]{7})[\-]([0-9]{1})+/;

    if(!cnicReg.test(cnic))
        return res.status(400).json({ error: "Please enter a valid CNIC."});

    if (name.length > 15 || name.length < 3)
        return res
            .status(400)
            .json({ error: "Name can only be between 4-25 characters." });

    if (!emailReg.test(email))
        return res
        .status(400)
        .json({ error: "Please enter a valid email address" });

    if (password.length < 6)
        return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
      
    if(address.length < 6)
        return res.status(400).json({ error: "Invalid address." });

    try {
        const checkIfTeacherExists = await fetch(
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
                collection: "teachers",
                filter: {cnic},
              }),
            }
        );
        const doesTeacherExists = await checkIfTeacherExists.json();
        if (doesTeacherExists.document)
            return res.status(400).json({ error: "Teacher already exists" });

        const hashPassword = await bcrypt.hash(password, 12);

        const newTeacher = await fetch(
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
                collection: "teachers",
                document: {
                    cnic, name, email, password: hashPassword, education, address, phone_number, faculty_id, salary, gender, designation, date_of_joining
                }
              })
            }
        );

        const teacherCreated = await newTeacher.json()
        if(teacherCreated.insertedId)
            return res.status(201).json(teacherCreated.insertedId);

    } catch (error) {
        console.log(error)
    }

})

router.put("/update-teacher", async (req, res) => {
    const {snic, name, email, password, education, address, phone_number, faculty_id, salary, gender, designation, date_of_joining} = req.body;

    if(!cnic || !name || !email || !password ||!education || !address || !phone_number || !faculty_id || !salary || !gender || !designation || !date_of_joining)
        return res.status(400).json({ error: "Please enter all the details" });

    const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const cnicReg =
    /^([0-9]{5})[\-]([0-9]{7})[\-]([0-9]{1})+/;

    if(!cnicReg.test(cnic))
        return res.status(400).json({ error: "Please enter a valid CNIC."});

    if (name.length > 15 || name.length < 3)
        return res
            .status(400)
            .json({ error: "Name can only be between 4-25 characters." });

    if (!emailReg.test(email))
        return res
        .status(400)
        .json({ error: "Please enter a valid email address" });

    if (password.length < 6)
        return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
      
    if(address.length < 6)
        return res.status(400).json({ error: "Invalid address." });

    try {
        const checkIfTeacherExists = await fetch(
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
                collection: "teachers",
                filter: {cnic},
              }),
            }
        );
        const doesTeacherExists = await checkIfTeacherExists.json();

        if (!doesTeacherExists.document)
            return res.status(400).json({ error: "Teacher does not exists" });

        const updateTeacher = await fetch(
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
                collection: "teachers",
                filter: {email},
                update: {
                    $set: {
                        cnic, name, email, password, education, address, phone_number, faculty_id, salary, gender, designation, date_of_joining
                    }
                }
                }),
            }
        );

        const updatedTeacherData = await updateTeacher.json()
        if(updatedTeacherData.modifiedCount)
            return res.status(200).json("Teacher Updated Successfully!");
    } catch (error) {
        console.log(error)
    }
})

router.delete("/delete-teacher", async (req, res) => {
    const { cnic } = req.body;

    const cnicReg =
    /^([0-9]{5})[\-]([0-9]{7})[\-]([0-9]{1})+/;

    if(!cnicReg.test(cnic))
        return res.status(400).json({ error: "Please enter a valid CNIC."});

        try {
            const deleteTeacher = await fetch(
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
                    collection: "teachers",
                    filter: {cnic},
                  }),
                }
            );
            const deletedTeacher = await deleteTeacher.json();
            if(!deletedTeacher.deletedCount)
                return res.status(400).json({ error: "Delete failed!"});
            
            return res.status(200).json("Deleted successfully");
        } catch (error) {
            console.log(error)
        }
})

module.exports = router;