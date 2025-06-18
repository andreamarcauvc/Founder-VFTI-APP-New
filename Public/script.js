document.addEventListener("DOMContentLoaded", function () {

    emailjs.init("RWSvKvvL3y3M4kRhL");
    const startTestButton = document.getElementById("startTest");
    const testSection = document.getElementById("testSection");
    const questionnaire = document.getElementById("questionnaire");
    const resultSection = document.getElementById("resultSection");
    const emailCollectionSection = document.getElementById("emailCollectionSection");
    const submitEmailButton = document.getElementById("submitEmail");

    if (startTestButton) {
        startTestButton.addEventListener("click", function () {
            questionnaire.style.display = "none";
            emailCollectionSection.style.display = "block";
        });
    }

    if (submitEmailButton) {
        submitEmailButton.addEventListener("click", function () {
            const founderName = document.getElementById("founderName").value;
            const startupName = document.getElementById("startupName").value;
            const email = document.getElementById("email").value;

            if (founderName && startupName && email) {
                emailCollectionSection.style.display = "none";
                testSection.style.display = "block";
                shuffleQuestions();
                loadQuestion();
            } else {
                alert("Please fill in all the fields.");
            }
        });
    }
});

let questions = [
    { q: "When starting a new project, what aspect energizes you the most?", o1: "Envisioning the long-term impact and innovative possibilities.", o2: "Laying out a detailed plan to execute the project effectively.", category: "VE" },
    { q: "How do you approach problem-solving?", o1: "Thinking broadly about various concepts and potential groundbreaking solutions.", o2: "Analyzing specifics and developing step-by-step solutions.", category: "VE" },
    { q: "What motivates you during challenging times?", o1: "The possibility of making a significant change.", o2: "Satisfaction in achieving progress.", category: "VE" },
    { q: "In team discussions, you prefer to:", o1: "Inspire others with big-picture ideas.", o2: "Focus on actionable items.", category: "VE" },
    { q: "When evaluating success, you prioritize:", o1: "The extent to which your vision has transformed the industry.", o2: "The efficiency of execution.", category: "VE" },
    
    { q: "When your venture faces unexpected challenges, your approach is to:", o1: "Embrace flexibility and adjust strategies.", o2: "Demonstrate tenacity by staying the course.", category: "AC" },
    { q: "In planning your startup’s growth, you prefer to:", o1: "Keep plans fluid, adapting quickly.", o2: "Maintain strategic focus on long-term goals.", category: "AC" },
    { q: "When considering potential pivots or changes in direction, you:", o1: "Readily pivot if it aligns with market needs.", o2: "Carefully evaluate and prioritize consistency.", category: "AC" },
    { q: "How do you manage your team’s efforts when new trends emerge?", o1: "Encourage the team to integrate new ideas.", o2: "Keep the team focused on objectives.", category: "AC" },
    { q: "Your leadership style is best described as:", o1: "Flexible and responsive.", o2: "Steadfast and reliable.", category: "AC" },

    { q: "When tackling complex problems, your strength lies in:", o1: "Independently dive into complex problems.", o2: "Collaborate to leverage a variety of insights.", category: "IC" },
    { q: "In terms of work style, you would describe yourself as:", o1: "Self-starter who refines concepts on your own.", o2: "Brainstorm and build ideas with a team.", category: "IC" },
    { q: "When approaching new tasks, you tend to:", o1: "Take initiative independently.", o2: "Involve team members.", category: "IC" },
    { q: "In decision-making, you rely more on:", o1: "Make decisions independently.", o2: "Value collective input.", category: "IC" },
    { q: "How do you prefer to communicate progress?", o1: "Communicate through detailed reports.", o2: "Regular meetings to keep everyone aligned.", category: "IC" },

    { q: "What primarily drives your product development decisions?", o1: "Driven by customer feedback and market demands.", o2: "Pursue technical excellence and product features.", category: "MP" },
    { q: "When considering a new feature or improvement, you:", o1: "Focus on meeting customer needs.", o2: "Enhance core functionality.", category: "MP" },
    { q: "How do you handle early product feedback?", o1: "Adapt offerings to align with expectations.", o2: "Stay true to product vision.", category: "MP" },
    { q: "When analyzing competitors, you focus on:", o1: "Analyze competitors' positioning.", o2: "Assess product features and design.", category: "MP" },
    { q: "You gauge success primarily by:", o1: "Gauge success by market adoption.", o2: "Gauge success by product quality.", category: "MP" }
];


let responses = [];
let currentQuestion = 0;



function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100; // Calculate percentage
    document.getElementById("progressBar").style.width = `${progress}%`; // Update width
}

let dimension_descriptions = {
    "V": "Visionary (V): You are driven by big ideas and future possibilities. You enjoy conceptualizing transformative concepts and are motivated by the potential impact of your venture. You thrive when exploring innovative solutions and setting ambitious goals.",
    "E": "Executor (E): You excel at turning ideas into reality through practical implementation. You are detail-oriented, focused on planning, organizing, and ensuring that tasks are completed efficiently. You find satisfaction in achieving tangible results and making consistent progress.",
    "A": "Adaptable (A): You are flexible and open to change, readily adjusting strategies as new information emerges. You thrive in dynamic environments and view unexpected challenges as opportunities to innovate.",
    "C": "Consistent (C): You value stability and steadfastness, focusing on long-term goals with determination. You believe that persistence and a consistent approach are key to building momentum and achieving success.",
    "I": "Independent (I): You prefer to work autonomously and rely on your expertise. As a self-starter, you are comfortable diving deep into tasks alone and making decisions independently. You value the freedom to innovate without external constraints.",
    "C2": "Collaborative (C): You thrive in team settings, valuing diverse perspectives and collective problem-solving. You believe that engaging with others leads to richer ideas and more robust solutions. Shared responsibility energizes you.",
    "M": "Market-Centric (M): You focus on understanding customer needs, market trends, and competitive dynamics. Aligning your offerings with market demand is a priority, and you actively seek feedback to tailor your product or service accordingly.",
    "P": "Product-Centric (P): You are passionate about developing and refining your product or service. You prioritize innovation, quality, and the inherent value of your offerings, believing that excellence will naturally attract customers."
};


let cofounder_suggestions = {
     "VAIM": "Look for co-founders who excel in execution and technical product development to transform your ambitious market strategies into actionable plans. Additionally, include a creative, design-focused collaborator to ensure user appeal and refine market positioning.",
    "VACM": "Partner with a structured executor who can bring operational discipline to your collaborative leadership. Complement this with a product-focused innovator who ensures technical feasibility while aligning with your market-driven approach.",
    "VCCM": "Seek a dynamic problem-solver who introduces flexibility and fresh ideas to balance your consistent strategies. Pair this with a technically skilled collaborator who can refine processes and deliver scalable, market-ready solutions.",
    "EAIM": "Align with a visionary strategist who sets ambitious long-term goals and inspires the team. Add a product innovator to bring creative solutions to your execution-driven approach, ensuring adaptability to evolving market needs.",
    "EACM": "Collaborate with a forward-thinking visionary who identifies opportunities and defines bold strategies. Pair them with a technical developer who bridges your adaptable style with innovative, customer-focused product solutions.",
    "ECIM": "Balance your consistency with a creative partner who generates out-of-the-box ideas and adapts to change. Add a collaborator who excels in building bridges between technical functionality and customer expectations.",
    "ECCM": "Look for a visionary collaborator who uncovers market opportunities and inspires growth. Complement this with an adaptable technical expert who ensures your steady execution incorporates innovative solutions.",
    "VCIP": "Partner with a commercially savvy strategist who bridges your product ideas to market needs. Include a methodical executor who maintains technical precision and a flexible collaborator who fosters team adaptability.",
    "VCIM": "Seek a technically proficient product specialist to refine your market-focused vision. Add a commercially oriented team player who enhances customer alignment and a flexible innovator to inject creativity.",
    "VACP": "Collaborate with a commercially focused strategist who positions products competitively in the market. Complement this with a disciplined executor who ensures technical delivery and a creative thinker who refines your product’s appeal.",
    "EAIP": "Partner with a visionary market strategist who ensures your products resonate with customers. Add a technically creative developer to innovate and a steady executor to maintain operational efficiency.",
    "VAIP": "Work with a commercially strategic co-founder who scales products effectively. Pair them with an organized executor for structure and a product innovator to align development with customer expectations.",
    "VCCP": "Collaborate with a market-driven strategist who identifies customer-centric opportunities. Add an adaptable designer to innovate and a disciplined executor who ensures technical delivery aligns with your consistent approach.",
    "EACP": "Join forces with a visionary co-founder who inspires bold strategies and aligns the team. Add a product innovator who adapts to change and a steady executor who ensures consistent progress.",
    "ECIP": "Partner with a commercially oriented strategist who expands market opportunities and customer alignment. Complement this with a creative technical expert and an adaptable collaborator who balances structure with innovation.",
    "ECCP": "Seek a visionary strategist who connects your product to future market demands. Add a dynamic technical innovator who creates unique solutions and a commercially focused collaborator who maximizes customer reach."
};



function shuffleQuestions() {
    // Divide le domande in gruppi di 5
    let questionGroups = [
        questions.slice(0, 5),
        questions.slice(5, 10),
        questions.slice(10, 15),
        questions.slice(15)
    ];

    // Mescola internamente ciascun gruppo
    questionGroups = questionGroups.map(group => 
        group.sort(() => Math.random() - 0.5)
    );

    // Ricompone l'array delle domande
    questions = [
        ...questionGroups[0],
        ...questionGroups[1],
        ...questionGroups[2],
        ...questionGroups[3]
    ];
}

function shuffleAnswers(question) {
    let isSwapped = Math.random() > 0.5;
    question.swapped = isSwapped; // Aggiungi una proprietà per tracciare lo scambio
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        let question = questions[currentQuestion];

        // Shuffle answers only once
        if (question.swapped === undefined) {
            shuffleAnswers(question);
        }

        // Display question and shuffled answers
        document.getElementById("question").innerText = question.q;
        document.getElementById("option1").innerText = question.swapped ? question.o2 : question.o1;
        document.getElementById("option2").innerText = question.swapped ? question.o1 : question.o2;

        updateProgressBar();
        highlightSelectedOption(); // Highlight the saved option

        // Manage navigation buttons
        document.getElementById("backButton").disabled = currentQuestion === 0;
        document.getElementById("forwardButton").disabled = !responses[currentQuestion];
    } else {
        submitTest();
    }
}



function chooseOption(option) {
    const question = questions[currentQuestion];

    // Determine the corrected option based on swap state
    const value = question.swapped
        ? (option === 1 ? 2 : 1) // Reverse option if answers are swapped
        : option;

    // Save the response as an object with category and value
    responses[currentQuestion] = { category: question.category, value };

    // Update highlight immediately
    highlightSelectedOption();

    // Automatically move to the next question
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}



function highlightSelectedOption() {
    const question = questions[currentQuestion];
    const savedResponse = responses[currentQuestion];

    // Reset highlights
    document.getElementById("option1").classList.remove("selected");
    document.getElementById("option2").classList.remove("selected");

    // Check the saved response value and highlight the correct button
    if (savedResponse && savedResponse.value === (question.swapped ? 2 : 1)) {
        document.getElementById("option1").classList.add("selected");
    } else if (savedResponse && savedResponse.value === (question.swapped ? 1 : 2)) {
        document.getElementById("option2").classList.add("selected");
    }
}




function goForward() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}

function goBack() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}




function submitTest() {
    const scores = { VE: 0, AC: 0, IC: 0, MP: 0 };

    // Group responses and compute scores
    responses.forEach(response => {
        if (response.value === 1) { 
            scores[response.category]++; // Option 1 corresponds to one side
        }
    });

    // Determine dominant traits based on scores
    const dominant_traits = [
        scores.VE > 2 ? 'V' : 'E',
        scores.AC > 2 ? 'A' : 'C',
        scores.IC > 2 ? 'I' : 'C2', // "C2" here
        scores.MP > 2 ? 'M' : 'P'
    ];

    const founder_type = dominant_traits.join("");
    const clean_founder_type = founder_type.replace("C2", "C"); // Replace "C2" with "C" for suggestions

    const trait_descriptions = dominant_traits.map(trait => dimension_descriptions[trait]).join("<br><br>");
    const suggestion = cofounder_suggestions[clean_founder_type] || "Your profile is unique! Seek collaborators who complement your entrepreneurial style.";

    document.getElementById("testSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";
    document.getElementById("founderType").innerHTML = clean_founder_type;
    document.getElementById("profileDescription").innerHTML = `<h3>Profile Description:</h3>${trait_descriptions}<br><br><h3>Co-Founder Suggestions:</h3>${suggestion}`;

    // Send results to backend (added to fix Andrea's version)
    const founderName = document.getElementById("founderName").value;
    const startupName = document.getElementById("startupName").value;
    const email = document.getElementById("email").value;
    sendToBackend(founderName, startupName, email, clean_founder_type, trait_descriptions, suggestion);
}


// Updated function to send data to your backend server
function sendToBackend(founderName, startupName, email, founderType, traitDescriptions, suggestion) {
    const scriptURL = "https://founder-vfti-app-new.onrender.com/submit"; // URL to your backend

    const payload = {
        founderName: founderName,
        startupName: startupName,
        email: email,
        founderType: founderType,
        traitDescriptions: traitDescriptions,
        suggestion: suggestion
    };

    fetch(scriptURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        if (result.result === "success") {
    console.log("Data logged successfully:", result);

    // Send email via EmailJS
    emailjs.send("service_dgfn4xo", "template_vr4k7cd", {
        founderName: founderName,
        startupName: startupName,
        email: email,
        founderType: founderType,
        traitDescriptions: traitDescriptions,
        suggestion: suggestion
    })
    .then(function(response) {
        console.log("Email successfully sent!", response.status, response.text);
    }, function(error) {
        console.error("Email failed to send:", error);
    });
} else {
            console.error("Error logging data:", result.error);
        }
    })
    .catch(error => {
        console.error("Error sending data:", error);
    });
}
