const fs = require("fs");
const fetch = require('node-fetch');

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

// Function to fetch and extract data
async function fetchData(id) {
  try {
    const response = await fetch(
      `${process.env.ED_URL}=${id}`,
      {
        method: "GET",
        headers: headers,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
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
      difficulty: data.difficulty_level,
      answer: data.correct_answer,
      explanation: data.explanation,
    };

    return formattedData
  } catch (error) {
    console.error("Error:", error);
  }
}

router.get("/fetch-questions", async (req, res) => {
  try {
    const lastQuestion = await Question.findOne({}, {}, { sort: { id: -1 } });

    const prev_end = lastQuestion?.id ?? 11086;

    if(prev_end>=15000) return res
    .status(200)
    .json({ message: "Upper limit reached fro questions." });

    const limit = 200
    const startId = prev_end + 1;
    const endId = prev_end + limit;
    const fetchPromises = [];
    for (let id = startId; id <= endId; id++) {
      fetchPromises.push(fetchData(id));
    }

    const fetchedDataArray = await Promise.all(fetchPromises);
    await Question.insertMany(fetchedDataArray);

    return res
      .status(200)
      .json({ message: "Questions fetched and inserted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching and inserting questions." });
  }
});

module.exports = router;
