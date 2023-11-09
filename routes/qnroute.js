const fs = require("fs");
const axios = require("axios");

const express = require("express");
const router = express.Router();

const Question = require("../schema/Question");
const headers = {
  method: "GET",
  Cookie:
    "cw_conversation=eyJhbGciOiJIUzI1NiJ9.eyJzb3VyY2VfaWQiOiJjZGVkNDg2Yi0wZjc1LTRiZGQtODgyZi0xZTcxNTZjMTAwMDkiLCJpbmJveF9pZCI6MX0.D7RNASHapz_PXKVvIq0_naD-zJNUksbfbF62bYBHJCM; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IkdOOUJ3SEVkN29xSUMzSlVCek9kU1E9PSIsInZhbHVlIjoiUFB3Z1J5cDV6bzdlZmV1dS9QMFBuTGN4OEYzK1JJQWliU2p1Um1sTzVLdVZhNFlyN0xRVFRhZjVSaHRBVXRLQ1RaNjJCN3ZveXlQZ3c2bzJ2QUlocmtHcEJqYTdIWXZPd2YvZjdtR2xQMzVwVVNVQk05OURYcHZ0aWwxOFNsb3R5OVh1T3FOOHhuR05TT2N0STlFUlR4QWRsYjBHQkQvTndEaVJaQnFjYTUzdGJJRzFRa2MwLytzeUN6SFQvL1liZzJMcGFXNUsxdjYwSlRpQzNrVzY0OEdOYjM2eG52cHVZU3U0amhRSGNCWT0iLCJtYWMiOiIwZjBhM2NjN2MzZDc0Mzc4MDFlNTlhNDYxMDljY2VjZjJmYWNjNjk5NDEzZTliMzBmMTdlZmM0ZWI0NWMxOTVjIiwidGFnIjoiIn0%3D; cw_snooze_campaigns_till=1699344546865; XSRF-TOKEN=eyJpdiI6InBOVlAwWm83RWtvM3Z6Y2ZkT0FSdkE9PSIsInZhbHVlIjoiMHViNGExbzNOOVVjMlJRNHo1RS96QkpDREVvTi9pTEthRFIxRWJGNUJHM1ZENFNWaldqUFZzVkQ5Y0JmQjZ6UHdTNk1BMWlxK2ZQdUt4YkhBektrak9kMWdxaXhhVVl2d1lLZytvb2VydG52ZEVJaC9xUDZoeVJ5MUk1ZUk2YlUiLCJtYWMiOiI1ZTBjM2Y4YzhjMDVmMDc0YjE5ZmJmNDhkNTkxZGYyNzc3ZTY1YjY3NTcxNGYyNmUxYTczMmQxOTkxN2JkNjE3IiwidGFnIjoiIn0%3D; entrancedose_session=eyJpdiI6Im40UXJnZWttNjJMREhOb0dUZWNaNEE9PSIsInZhbHVlIjoiQUZvU0M3UkdmTFZjcUNOMXZhOFdSKzM2TTJsdWFhSkRBTmdGQUJLalF4azR0ZnFwalJLVDNCQytqUU9Ub3hBSWNENmpqUjFnOURRYTg1VWJBQ2lxYUlqK2xZcXBudUwva0xjdUhSR0FBd1JWQUxLbko1aUpoV3UreGpSM3J4aVoiLCJtYWMiOiI5MGMyYjYzMDRhZDY5MGY5MWJhZjg2MWU0NWQ0NWY2M2M2NjVlYjlkMWYxZWMyMGM3ZmIwZTllYWMwYmFhM2FkIiwidGFnIjoiIn0%3D",
  Origin: "https://merosiksha.com",
  Referer: "https://entrancedose.com/login",
};

const dumm = {
  id: 0,
  question: "a random",
  options: {
    a: "a",
    b: "b",
    c: "v",
    d: "d",
  },
  sub: 0,
  topic: 0,
  difficulty: "medium",
  answer: 1,
  explanation: "null",
};

async function fetchData(id) {
  try {
  const response = await axios.get(`${process.env.ED_URL}=${id}`, {
    headers: headers,
  });
    if (response.status !== 200) {
      console.log("error", response.status);
      dumm.id = id
      return dumm;
    }
    const data = response.data;
    const formattedData = {
      id: data.id,
      question: data.question,
      options: {
        a: data.answers[0].option_value,
        b: data.answers[1].option_value,
        c: data.answers[2].option_value,
        d: data.answers[3].option_value,
      },
      sub: data.subject_id,
      topic: data.topic_id,
      difficulty: data.difficulty_level || "medium",
      answer: data.correct_answer || 1,
      explanation: data.explanation || "",
    };
    return formattedData;
  } catch (error) {
    console.log("Errorrrrrrrrrrrrrr:", error);
    dumm.id = id
    return dumm;
  }
}

router.get("/fetch-questions", async (req, res) => {
  try {
    const lastQuestion = await Question.findOne({}, {}, { sort: { id: -1 } });
    const prev_end = lastQuestion?.id ?? 11086;

    if (prev_end >= 15000) return res.status(200).json({ message: "Upper limit reached for questions." });

    const limit = 60;
    const startId = prev_end + 1;
    const endId = prev_end + limit;
    const fetchedDataArray = [];

    for (let id = startId; id <= endId; id++) {
      const questionData = await fetchData(id);
      fetchedDataArray.push(questionData);
    }

    if (fetchedDataArray.length > 0) {
      await Question.insertMany(fetchedDataArray);
      return res
        .status(200)
        .json({ message: "Questions fetched and inserted successfully." });
    } 
  } catch (error) {
    return res.status(500).json({ message: "Error fetching and inserting questions." });
  }
});


module.exports = router;
