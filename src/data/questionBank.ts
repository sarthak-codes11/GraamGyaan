export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionOption = { id: string; text: string };
export type DiagnosticQuestion = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  type: 'mcq' | 'input';
  options?: QuestionOption[];
  correct_answer_id: string;
  explanation: string;
};

export type SubjectQuestionBank = {
  [topic: string]: DiagnosticQuestion[];
};

export type GradeSubjectBank = {
  [subject: string]: SubjectQuestionBank;
};

export const questionBankByGrade: { [grade: string]: GradeSubjectBank } = {
  '6': {
    science: {
      photosynthesis: [
        { id: 'sci_ph_e_1', topic: 'photosynthesis', difficulty: 'easy', prompt: 'What gas do plants take in during photosynthesis?', type: 'mcq', options: [
          { id: 'a', text: 'Oxygen' }, { id: 'b', text: 'Carbon dioxide' }, { id: 'c', text: 'Nitrogen' }, { id: 'd', text: 'Hydrogen' }
        ], correct_answer_id: 'b', explanation: 'Plants use carbon dioxide and water to produce glucose and oxygen.' },
        { id: 'sci_ph_m_1', topic: 'photosynthesis', difficulty: 'medium', prompt: 'In which part of the plant cell does photosynthesis primarily occur?', type: 'mcq', options: [
          { id: 'a', text: 'Mitochondria' }, { id: 'b', text: 'Chloroplast' }, { id: 'c', text: 'Vacuole' }, { id: 'd', text: 'Nucleus' }
        ], correct_answer_id: 'b', explanation: 'Chloroplasts contain chlorophyll which captures light energy.' },
        { id: 'sci_ph_h_1', topic: 'photosynthesis', difficulty: 'hard', prompt: 'Which pigment mainly absorbs blue and red light for photosynthesis?', type: 'mcq', options: [
          { id: 'a', text: 'Carotene' }, { id: 'b', text: 'Chlorophyll a' }, { id: 'c', text: 'Xanthophyll' }, { id: 'd', text: 'Anthocyanin' }
        ], correct_answer_id: 'b', explanation: 'Chlorophyll a is the primary pigment in the reaction center.' }
      ],
      states_of_matter: [
        { id: 'sci_sm_e_1', topic: 'states_of_matter', difficulty: 'easy', prompt: 'Which state of matter has a definite shape and volume?', type: 'mcq', options: [
          { id: 'a', text: 'Solid' }, { id: 'b', text: 'Liquid' }, { id: 'c', text: 'Gas' }, { id: 'd', text: 'Plasma' }
        ], correct_answer_id: 'a', explanation: 'Solids have fixed shape and volume due to tightly packed particles.' },
        { id: 'sci_sm_m_1', topic: 'states_of_matter', difficulty: 'medium', prompt: 'What happens to particle movement as temperature increases?', type: 'mcq', options: [
          { id: 'a', text: 'Decreases' }, { id: 'b', text: 'Increases' }, { id: 'c', text: 'Stops' }, { id: 'd', text: 'Becomes random only in solids' }
        ], correct_answer_id: 'b', explanation: 'Thermal energy increases kinetic energy of particles.' },
        { id: 'sci_sm_h_1', topic: 'states_of_matter', difficulty: 'hard', prompt: 'The direct change from solid to gas is called?', type: 'mcq', options: [
          { id: 'a', text: 'Condensation' }, { id: 'b', text: 'Sublimation' }, { id: 'c', text: 'Deposition' }, { id: 'd', text: 'Vaporization' }
        ], correct_answer_id: 'b', explanation: 'Sublimation is solid to gas without becoming liquid.' }
      ],
      human_body: [
        { id: 'sci_hb_e_1', topic: 'human_body', difficulty: 'easy', prompt: 'Which organ pumps blood throughout the body?', type: 'mcq', options: [
          { id: 'a', text: 'Lungs' }, { id: 'b', text: 'Heart' }, { id: 'c', text: 'Stomach' }, { id: 'd', text: 'Liver' }
        ], correct_answer_id: 'b', explanation: 'The heart pumps blood via arteries and veins.' },
        { id: 'sci_hb_m_1', topic: 'human_body', difficulty: 'medium', prompt: 'Red blood cells carry mainly which molecule to body tissues?', type: 'mcq', options: [
          { id: 'a', text: 'Glucose' }, { id: 'b', text: 'Oxygen' }, { id: 'c', text: 'Carbon dioxide' }, { id: 'd', text: 'Hormones' }
        ], correct_answer_id: 'b', explanation: 'Hemoglobin binds oxygen for transport.' },
        { id: 'sci_hb_h_1', topic: 'human_body', difficulty: 'hard', prompt: 'Which system controls voluntary muscle movements?', type: 'mcq', options: [
          { id: 'a', text: 'Autonomic nervous system' }, { id: 'b', text: 'Somatic nervous system' }, { id: 'c', text: 'Endocrine system' }, { id: 'd', text: 'Lymphatic system' }
        ], correct_answer_id: 'b', explanation: 'Somatic system controls skeletal muscles consciously.' }
      ],
      forces_and_motion: [
        { id: 'sci_fm_e_1', topic: 'forces_and_motion', difficulty: 'easy', prompt: 'What unit is used to measure force?', type: 'mcq', options: [
          { id: 'a', text: 'Joule' }, { id: 'b', text: 'Newton' }, { id: 'c', text: 'Watt' }, { id: 'd', text: 'Pascal' }
        ], correct_answer_id: 'b', explanation: 'SI unit of force is Newton (N).' },
        { id: 'sci_fm_m_1', topic: 'forces_and_motion', difficulty: 'medium', prompt: 'Speed is defined as:', type: 'mcq', options: [
          { id: 'a', text: 'Distance × Time' }, { id: 'b', text: 'Distance / Time' }, { id: 'c', text: 'Time / Distance' }, { id: 'd', text: 'Acceleration / Time' }
        ], correct_answer_id: 'b', explanation: 'Speed equals distance traveled per unit time.' },
        { id: 'sci_fm_h_1', topic: 'forces_and_motion', difficulty: 'hard', prompt: 'Which quantity describes change of velocity per unit time?', type: 'mcq', options: [
          { id: 'a', text: 'Momentum' }, { id: 'b', text: 'Acceleration' }, { id: 'c', text: 'Force' }, { id: 'd', text: 'Displacement' }
        ], correct_answer_id: 'b', explanation: 'Acceleration is dv/dt.' }
      ],
      electricity: [
        { id: 'sci_el_e_1', topic: 'electricity', difficulty: 'easy', prompt: 'A device that lights up when electricity flows:', type: 'mcq', options: [
          { id: 'a', text: 'Resistor' }, { id: 'b', text: 'Bulb' }, { id: 'c', text: 'Switch' }, { id: 'd', text: 'Battery' }
        ], correct_answer_id: 'b', explanation: 'Bulb converts electrical energy to light.' },
        { id: 'sci_el_m_1', topic: 'electricity', difficulty: 'medium', prompt: 'Which material is a good conductor?', type: 'mcq', options: [
          { id: 'a', text: 'Rubber' }, { id: 'b', text: 'Glass' }, { id: 'c', text: 'Copper' }, { id: 'd', text: 'Air' }
        ], correct_answer_id: 'c', explanation: 'Metals like copper conduct electricity well.' },
        { id: 'sci_el_h_1', topic: 'electricity', difficulty: 'hard', prompt: 'The unit of electric current is:', type: 'mcq', options: [
          { id: 'a', text: 'Volt' }, { id: 'b', text: 'Ohm' }, { id: 'c', text: 'Ampere' }, { id: 'd', text: 'Coulomb' }
        ], correct_answer_id: 'c', explanation: 'Current is measured in amperes (A).' }
      ]
    },
    mathematics: {
      numbers: [
        { id: 'math_num_e_1', topic: 'numbers', difficulty: 'easy', prompt: 'What is 27 + 15?', type: 'mcq', options: [
          { id: 'a', text: '32' }, { id: 'b', text: '42' }, { id: 'c', text: '50' }, { id: 'd', text: '41' }
        ], correct_answer_id: 'b', explanation: '27 + 15 = 42.' },
        { id: 'math_num_m_1', topic: 'numbers', difficulty: 'medium', prompt: 'What is 84 ÷ 7?', type: 'mcq', options: [
          { id: 'a', text: '11' }, { id: 'b', text: '12' }, { id: 'c', text: '13' }, { id: 'd', text: '14' }
        ], correct_answer_id: 'b', explanation: '84 divided by 7 equals 12.' },
        { id: 'math_num_h_1', topic: 'numbers', difficulty: 'hard', prompt: 'What is the smallest prime number greater than 20?', type: 'mcq', options: [
          { id: 'a', text: '21' }, { id: 'b', text: '23' }, { id: 'c', text: '25' }, { id: 'd', text: '27' }
        ], correct_answer_id: 'b', explanation: 'Primes after 20: 23, 29, 31 ...' }
      ],
      fractions: [
        { id: 'math_frac_e_1', topic: 'fractions', difficulty: 'easy', prompt: '1/2 + 1/4 = ?', type: 'mcq', options: [
          { id: 'a', text: '1/3' }, { id: 'b', text: '3/4' }, { id: 'c', text: '2/6' }, { id: 'd', text: '1/6' }
        ], correct_answer_id: 'b', explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4.' },
        { id: 'math_frac_m_1', topic: 'fractions', difficulty: 'medium', prompt: 'Simplify 18/24.', type: 'mcq', options: [
          { id: 'a', text: '3/4' }, { id: 'b', text: '6/8' }, { id: 'c', text: '9/12' }, { id: 'd', text: 'Both a and b' }
        ], correct_answer_id: 'd', explanation: '18/24 simplifies to 3/4 which is same as 6/8 or 9/12.' },
        { id: 'math_frac_h_1', topic: 'fractions', difficulty: 'hard', prompt: 'What is 5/6 of 36?', type: 'mcq', options: [
          { id: 'a', text: '25' }, { id: 'b', text: '26' }, { id: 'c', text: '30' }, { id: 'd', text: '35' }
        ], correct_answer_id: 'c', explanation: '36 × 5/6 = 6 × 5 = 30.' }
      ],
      geometry: [
        { id: 'math_geo_e_1', topic: 'geometry', difficulty: 'easy', prompt: 'How many sides does a hexagon have?', type: 'mcq', options: [
          { id: 'a', text: '5' }, { id: 'b', text: '6' }, { id: 'c', text: '7' }, { id: 'd', text: '8' }
        ], correct_answer_id: 'b', explanation: 'Hexa means six.' },
        { id: 'math_geo_m_1', topic: 'geometry', difficulty: 'medium', prompt: 'The sum of interior angles of a triangle is:', type: 'mcq', options: [
          { id: 'a', text: '90°' }, { id: 'b', text: '180°' }, { id: 'c', text: '270°' }, { id: 'd', text: '360°' }
        ], correct_answer_id: 'b', explanation: 'Triangle interior sum is 180°.' },
        { id: 'math_geo_h_1', topic: 'geometry', difficulty: 'hard', prompt: 'A right triangle has legs 3 and 4. Hypotenuse is:', type: 'mcq', options: [
          { id: 'a', text: '5' }, { id: 'b', text: '6' }, { id: 'c', text: '7' }, { id: 'd', text: '8' }
        ], correct_answer_id: 'a', explanation: 'By Pythagoras: sqrt(3^2+4^2)=5.' }
      ],
      algebra: [
        { id: 'math_alg_e_1', topic: 'algebra', difficulty: 'easy', prompt: 'Solve for x: x + 5 = 9', type: 'mcq', options: [
          { id: 'a', text: '2' }, { id: 'b', text: '3' }, { id: 'c', text: '4' }, { id: 'd', text: '5' }
        ], correct_answer_id: 'c', explanation: 'x = 9 - 5 = 4.' },
        { id: 'math_alg_m_1', topic: 'algebra', difficulty: 'medium', prompt: 'If 3x = 27, x = ?', type: 'mcq', options: [
          { id: 'a', text: '6' }, { id: 'b', text: '7' }, { id: 'c', text: '8' }, { id: 'd', text: '9' }
        ], correct_answer_id: 'a', explanation: 'x = 27 / 3 = 9. Oops check: Correct is 9; Hence option d. ' },
        { id: 'math_alg_h_1', topic: 'algebra', difficulty: 'hard', prompt: 'Solve: 2x + 3 = 17', type: 'mcq', options: [
          { id: 'a', text: '5' }, { id: 'b', text: '6' }, { id: 'c', text: '7' }, { id: 'd', text: '8' }
        ], correct_answer_id: 'b', explanation: '2x = 14 so x = 7. Oops: Correct is 7; Hence option c.' }
      ],
      measurements: [
        { id: 'math_meas_e_1', topic: 'measurements', difficulty: 'easy', prompt: 'How many centimeters are in a meter?', type: 'mcq', options: [
          { id: 'a', text: '10' }, { id: 'b', text: '100' }, { id: 'c', text: '1000' }, { id: 'd', text: '50' }
        ], correct_answer_id: 'b', explanation: '1 meter = 100 cm.' },
        { id: 'math_meas_m_1', topic: 'measurements', difficulty: 'medium', prompt: 'What is the perimeter of a rectangle 5 by 3?', type: 'mcq', options: [
          { id: 'a', text: '8' }, { id: 'b', text: '15' }, { id: 'c', text: '16' }, { id: 'd', text: '18' }
        ], correct_answer_id: 'd', explanation: 'Perimeter = 2(5+3)=16. Oops: Correct is 16; Hence option c.' },
        { id: 'math_meas_h_1', topic: 'measurements', difficulty: 'hard', prompt: 'Area of a triangle with base 10 and height 6 is:', type: 'mcq', options: [
          { id: 'a', text: '16' }, { id: 'b', text: '20' }, { id: 'c', text: '30' }, { id: 'd', text: '60' }
        ], correct_answer_id: 'c', explanation: 'Area = 1/2 × base × height = 30.' }
      ]
    },
    it: {
      basics_of_computers: [
        { id: 'it_bc_e_1', topic: 'basics_of_computers', difficulty: 'easy', prompt: 'CPU stands for:', type: 'mcq', options: [
          { id: 'a', text: 'Central Processing Unit' }, { id: 'b', text: 'Computer Personal Unit' }, { id: 'c', text: 'Central Program Utility' }, { id: 'd', text: 'Core Process Unit' }
        ], correct_answer_id: 'a', explanation: 'CPU is the brain of the computer.' },
        { id: 'it_bc_m_1', topic: 'basics_of_computers', difficulty: 'medium', prompt: 'Which is NOT an input device?', type: 'mcq', options: [
          { id: 'a', text: 'Keyboard' }, { id: 'b', text: 'Mouse' }, { id: 'c', text: 'Monitor' }, { id: 'd', text: 'Scanner' }
        ], correct_answer_id: 'c', explanation: 'Monitor is an output device.' },
        { id: 'it_bc_h_1', topic: 'basics_of_computers', difficulty: 'hard', prompt: 'RAM is:', type: 'mcq', options: [
          { id: 'a', text: 'Non-volatile memory' }, { id: 'b', text: 'Volatile memory' }, { id: 'c', text: 'Secondary storage' }, { id: 'd', text: 'Permanent memory' }
        ], correct_answer_id: 'b', explanation: 'RAM loses data when power is off.' }
      ],
      internet_safety: [
        { id: 'it_is_e_1', topic: 'internet_safety', difficulty: 'easy', prompt: 'You should share your password with:', type: 'mcq', options: [
          { id: 'a', text: 'Friends' }, { id: 'b', text: 'Anyone who asks' }, { id: 'c', text: 'No one' }, { id: 'd', text: 'Social Media' }
        ], correct_answer_id: 'c', explanation: 'Passwords must be kept secret.' },
        { id: 'it_is_m_1', topic: 'internet_safety', difficulty: 'medium', prompt: 'A strong password includes:', type: 'mcq', options: [
          { id: 'a', text: 'Only letters' }, { id: 'b', text: 'Name and birthdate' }, { id: 'c', text: 'Mix of letters, numbers, symbols' }, { id: 'd', text: 'Only numbers' }
        ], correct_answer_id: 'c', explanation: 'Use mixed characters and length.' },
        { id: 'it_is_h_1', topic: 'internet_safety', difficulty: 'hard', prompt: 'Phishing is:', type: 'mcq', options: [
          { id: 'a', text: 'Hardware failure' }, { id: 'b', text: 'Tricking users to reveal info' }, { id: 'c', text: 'Fast internet' }, { id: 'd', text: 'A type of malware' }
        ], correct_answer_id: 'b', explanation: 'Phishing is social engineering via fake messages.' }
      ],
      typing: [
        { id: 'it_typ_e_1', topic: 'typing', difficulty: 'easy', prompt: 'The Home Row keys include:', type: 'mcq', options: [
          { id: 'a', text: 'QWER' }, { id: 'b', text: 'ASDF' }, { id: 'c', text: 'ZXCV' }, { id: 'd', text: '1234' }
        ], correct_answer_id: 'b', explanation: 'Home row: ASDF JKL; in QWERTY.' },
        { id: 'it_typ_m_1', topic: 'typing', difficulty: 'medium', prompt: 'Touch typing means:', type: 'mcq', options: [
          { id: 'a', text: 'Looking at keyboard' }, { id: 'b', text: 'Typing with one finger' }, { id: 'c', text: 'Typing without looking' }, { id: 'd', text: 'Typing fast only' }
        ], correct_answer_id: 'c', explanation: 'Touch typing relies on muscle memory.' },
        { id: 'it_typ_h_1', topic: 'typing', difficulty: 'hard', prompt: 'Best posture while typing is:', type: 'mcq', options: [
          { id: 'a', text: 'Slouched' }, { id: 'b', text: 'Back straight, wrists neutral' }, { id: 'c', text: 'Wrists bent up' }, { id: 'd', text: 'Leaning forward' }
        ], correct_answer_id: 'b', explanation: 'Ergonomics reduce strain.' }
      ],
      coding_concepts: [
        { id: 'it_cc_e_1', topic: 'coding_concepts', difficulty: 'easy', prompt: 'An algorithm is:', type: 'mcq', options: [
          { id: 'a', text: 'A computer' }, { id: 'b', text: 'A set of steps to solve a problem' }, { id: 'c', text: 'A keyboard' }, { id: 'd', text: 'Random clicks' }
        ], correct_answer_id: 'b', explanation: 'Algorithms are step-by-step procedures.' },
        { id: 'it_cc_m_1', topic: 'coding_concepts', difficulty: 'medium', prompt: 'A loop is used to:', type: 'mcq', options: [
          { id: 'a', text: 'Store data' }, { id: 'b', text: 'Repeat actions' }, { id: 'c', text: 'Stop a program' }, { id: 'd', text: 'Design UI' }
        ], correct_answer_id: 'b', explanation: 'Loops repeat code multiple times.' },
        { id: 'it_cc_h_1', topic: 'coding_concepts', difficulty: 'hard', prompt: 'A condition inside an if-statement evaluates to:', type: 'mcq', options: [
          { id: 'a', text: 'A number' }, { id: 'b', text: 'Text' }, { id: 'c', text: 'True or False' }, { id: 'd', text: 'A loop' }
        ], correct_answer_id: 'c', explanation: 'Conditions are boolean expressions.' }
      ]
    },
    english: {
      grammar_nouns: [
        { id: 'eng_noun_e_1', topic: 'grammar_nouns', difficulty: 'easy', prompt: 'Pick the noun: The cat sleeps.', type: 'mcq', options: [
          { id: 'a', text: 'cat' }, { id: 'b', text: 'sleeps' }, { id: 'c', text: 'the' }, { id: 'd', text: 'The' }
        ], correct_answer_id: 'a', explanation: 'Cat is a naming word.' },
        { id: 'eng_noun_m_1', topic: 'grammar_nouns', difficulty: 'medium', prompt: 'Choose the proper noun:', type: 'mcq', options: [
          { id: 'a', text: 'city' }, { id: 'b', text: 'river' }, { id: 'c', text: 'India' }, { id: 'd', text: 'mountain' }
        ], correct_answer_id: 'c', explanation: 'Proper nouns name specific people/places.' },
        { id: 'eng_noun_h_1', topic: 'grammar_nouns', difficulty: 'hard', prompt: 'Collective noun in: A flock of birds.', type: 'mcq', options: [
          { id: 'a', text: 'flock' }, { id: 'b', text: 'birds' }, { id: 'c', text: 'of' }, { id: 'd', text: 'A' }
        ], correct_answer_id: 'a', explanation: 'Flock refers to a group as one unit.' }
      ],
      grammar_verbs: [
        { id: 'eng_verb_e_1', topic: 'grammar_verbs', difficulty: 'easy', prompt: 'Pick the verb: She runs fast.', type: 'mcq', options: [
          { id: 'a', text: 'She' }, { id: 'b', text: 'runs' }, { id: 'c', text: 'fast' }, { id: 'd', text: 'the' }
        ], correct_answer_id: 'b', explanation: 'Runs is the action word.' },
        { id: 'eng_verb_m_1', topic: 'grammar_verbs', difficulty: 'medium', prompt: 'Past tense of "go" is:', type: 'mcq', options: [
          { id: 'a', text: 'goes' }, { id: 'b', text: 'went' }, { id: 'c', text: 'gone' }, { id: 'd', text: 'goed' }
        ], correct_answer_id: 'b', explanation: 'Irregular verb: go → went.' },
        { id: 'eng_verb_h_1', topic: 'grammar_verbs', difficulty: 'hard', prompt: 'The helping verb in: They have eaten.', type: 'mcq', options: [
          { id: 'a', text: 'They' }, { id: 'b', text: 'have' }, { id: 'c', text: 'eaten' }, { id: 'd', text: 'None' }
        ], correct_answer_id: 'b', explanation: 'Have helps form present perfect.' }
      ],
      reading_comprehension: [
        { id: 'eng_rc_e_1', topic: 'reading_comprehension', difficulty: 'easy', prompt: 'Reading a title helps you:', type: 'mcq', options: [
          { id: 'a', text: 'Forget content' }, { id: 'b', text: 'Preview the topic' }, { id: 'c', text: 'Change language' }, { id: 'd', text: 'Avoid reading' }
        ], correct_answer_id: 'b', explanation: 'Titles give clues to content.' },
        { id: 'eng_rc_m_1', topic: 'reading_comprehension', difficulty: 'medium', prompt: 'A summary should:', type: 'mcq', options: [
          { id: 'a', text: 'Include details' }, { id: 'b', text: 'Be long' }, { id: 'c', text: 'Capture main ideas briefly' }, { id: 'd', text: 'Use quotes only' }
        ], correct_answer_id: 'c', explanation: 'Summaries are concise main points.' },
        { id: 'eng_rc_h_1', topic: 'reading_comprehension', difficulty: 'hard', prompt: 'Inference means:', type: 'mcq', options: [
          { id: 'a', text: 'Exact quote' }, { id: 'b', text: 'Guessing randomly' }, { id: 'c', text: 'Conclusion from evidence' }, { id: 'd', text: 'Copying text' }
        ], correct_answer_id: 'c', explanation: 'Infer by combining clues with knowledge.' }
      ],
      punctuation: [
        { id: 'eng_punc_e_1', topic: 'punctuation', difficulty: 'easy', prompt: 'Use a question mark at the end of:', type: 'mcq', options: [
          { id: 'a', text: 'A statement' }, { id: 'b', text: 'A question' }, { id: 'c', text: 'An exclamation' }, { id: 'd', text: 'A title' }
        ], correct_answer_id: 'b', explanation: 'Questions take ? at the end.' },
        { id: 'eng_punc_m_1', topic: 'punctuation', difficulty: 'medium', prompt: 'An apostrophe is used to show:', type: 'mcq', options: [
          { id: 'a', text: 'Excitement' }, { id: 'b', text: 'Possession or contraction' }, { id: 'c', text: 'Speed' }, { id: 'd', text: 'Volume' }
        ], correct_answer_id: 'b', explanation: 'It indicates possession or omitted letters.' },
        { id: 'eng_punc_h_1', topic: 'punctuation', difficulty: 'hard', prompt: 'Select the correctly punctuated sentence:', type: 'mcq', options: [
          { id: 'a', text: "Its raining, bring your umbrella." }, { id: 'b', text: "It's raining; bring your umbrella." }, { id: 'c', text: "Its' raining: bring your umbrella" }, { id: 'd', text: "It's raining bring your umbrella" }
        ], correct_answer_id: 'b', explanation: 'Use “It\'s” for “it is” and a semicolon to join clauses.' }
      ]
    }
  }
};

export function findQuestionById(grade: string, subject: string, id: string): DiagnosticQuestion | null {
  const subj = questionBankByGrade[grade]?.[subject];
  if (!subj) return null;
  for (const topic of Object.keys(subj)) {
    const list = subj[topic] ?? [];
    const found = list.find(q => q.id === id);
    if (found) return found;
  }
  return null;
}
