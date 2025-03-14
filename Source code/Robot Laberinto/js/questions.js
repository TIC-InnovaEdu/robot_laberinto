const questions = [
    {
        question: "¿Cuánto es 7 x 8?",
        options: [
            "54",
            "56",
            "64",
            "58"
        ],
        answer: "56"
    },
    {
        question: "¿Qué fracción representa la mitad de un entero?",
        options: [
            "1/4",
            "1/2",
            "2/4",
            "3/4"
        ],
        answer: "1/2"
    },
    {
        question: "¿Cuántos grados tiene un ángulo recto?",
        options: [
            "45°",
            "90°",
            "180°",
            "360°"
        ],
        answer: "90°"
    },
    {
        question: "¿Cuál es el perímetro de un cuadrado de lado 5 cm?",
        options: [
            "10 cm",
            "15 cm",
            "20 cm",
            "25 cm"
        ],
        answer: "20 cm"
    },
    {
        question: "¿Cuánto es 125 ÷ 5?",
        options: [
            "15",
            "20",
            "25",
            "30"
        ],
        answer: "25"
    },
    {
        question: "¿Qué número es el triple de 9?",
        options: [
            "18",
            "24",
            "27",
            "36"
        ],
        answer: "27"
    },
    {
        question: "¿Cuál es el resultado de 15 + 17?",
        options: [
            "30",
            "31",
            "32",
            "33"
        ],
        answer: "32"
    },
    {
        question: "¿Cuántos lados tiene un hexágono?",
        options: [
            "5",
            "6",
            "7",
            "8"
        ],
        answer: "6"
    },
    {
        question: "¿Cuál es el área de un rectángulo de base 6 cm y altura 4 cm?",
        options: [
            "10 cm²",
            "20 cm²",
            "24 cm²",
            "28 cm²"
        ],
        answer: "24 cm²"
    },
    {
        question: "¿Qué número decimal es equivalente a 1/4?",
        options: [
            "0.25",
            "0.4",
            "0.5",
            "0.75"
        ],
        answer: "0.25"
    },
    {
        question: "¿Cuánto es 1,000 - 375?",
        options: [
            "525",
            "625",
            "725",
            "825"
        ],
        answer: "625"
    },
    {
        question: "¿Cuál es el número que sigue en la secuencia: 2, 4, 8, 16, ...?",
        options: [
            "24",
            "28",
            "32",
            "36"
        ],
        answer: "32"
    },
    {
        question: "¿Cuántos centímetros hay en 1 metro?",
        options: [
            "10",
            "100",
            "1,000",
            "10,000"
        ],
        answer: "100"
    },
    {
        question: "¿Qué fracción es mayor: 3/4 o 2/3?",
        options: [
            "3/4",
            "2/3",
            "Son iguales",
            "No se puede determinar"
        ],
        answer: "3/4"
    },
    {
        question: "¿Cuál es el resultado de 42 ÷ 6?",
        options: [
            "5",
            "6",
            "7",
            "8"
        ],
        answer: "7"
    },
    {
        question: "¿Cuánto es 5 al cuadrado?",
        options: [
            "10",
            "15",
            "20",
            "25"
        ],
        answer: "25"
    },
    {
        question: "¿Qué número es el doble de 45?",
        options: [
            "80",
            "85",
            "90",
            "95"
        ],
        answer: "90"
    },
    {
        question: "¿Cuál es la raíz cuadrada de 81?",
        options: [
            "7",
            "8",
            "9",
            "10"
        ],
        answer: "9"
    },
    {
        question: "¿Cuántos minutos hay en 2 horas?",
        options: [
            "90",
            "100",
            "110",
            "120"
        ],
        answer: "120"
    },
    {
        question: "¿Cuál es el 25% de 200?",
        options: [
            "25",
            "40",
            "50",
            "75"
        ],
        answer: "50"
    },
    {
        question: "¿Cuánto es 18 x 5?",
        options: [
            "80",
            "85",
            "90",
            "95"
        ],
        answer: "90"
    },
    {
        question: "¿Cuál es el número par más cercano a 51?",
        options: [
            "50",
            "51",
            "52",
            "53"
        ],
        answer: "52"
    },
    {
        question: "¿Cuánto es 3.5 + 2.7?",
        options: [
            "5.2",
            "6.0",
            "6.2",
            "6.4"
        ],
        answer: "6.2"
    },
    {
        question: "¿Qué fracción representa tres cuartos?",
        options: [
            "1/4",
            "2/4",
            "3/4",
            "4/4"
        ],
        answer: "3/4"
    },
    {
        question: "¿Cuál es el resultado de 17 x 6?",
        options: [
            "92",
            "98",
            "102",
            "108"
        ],
        answer: "102"
    },
    {
        question: "¿Cuántos vértices tiene un triángulo?",
        options: [
            "2",
            "3",
            "4",
            "5"
        ],
        answer: "3"
    },
    {
        question: "¿Cuál es el número que falta: 15 + ___ = 40?",
        options: [
            "15",
            "20",
            "25",
            "30"
        ],
        answer: "25"
    },
    {
        question: "¿Cuánto es 1/2 + 1/4?",
        options: [
            "2/6",
            "3/4",
            "2/4",
            "3/6"
        ],
        answer: "3/4"
    },
    {
        question: "¿Cuál es el perímetro de un triángulo equilátero de lado 6 cm?",
        options: [
            "12 cm",
            "15 cm",
            "18 cm",
            "24 cm"
        ],
        answer: "18 cm"
    },
    {
        question: "¿Cuánto es 200 ÷ 8?",
        options: [
            "20",
            "25",
            "30",
            "35"
        ],
        answer: "25"
    },
    {
        question: "¿Qué número romano representa el 9?",
        options: [
            "VI",
            "VII",
            "VIII",
            "IX"
        ],
        answer: "IX"
    },
    {
        question: "¿Cuánto es 75% de 80?",
        options: [
            "55",
            "60",
            "65",
            "70"
        ],
        answer: "60"
    },
    {
        question: "¿Cuál es el resultado de 13 x 7?",
        options: [
            "81",
            "87",
            "91",
            "97"
        ],
        answer: "91"
    },
    {
        question: "¿Cuántos mililitros hay en 1 litro?",
        options: [
            "10",
            "100",
            "1,000",
            "10,000"
        ],
        answer: "1,000"
    },
    {
        question: "¿Cuál es el número impar más cercano a 100?",
        options: [
            "98",
            "99",
            "100",
            "101"
        ],
        answer: "99"
    },
    {
        question: "¿Cuánto es 4.8 - 2.3?",
        options: [
            "2.3",
            "2.4",
            "2.5",
            "2.6"
        ],
        answer: "2.5"
    },
    {
        question: "¿Qué fracción es menor: 2/5 o 1/2?",
        options: [
            "2/5",
            "1/2",
            "Son iguales",
            "No se puede determinar"
        ],
        answer: "2/5"
    },
    {
        question: "¿Cuánto es 16 x 4?",
        options: [
            "56",
            "60",
            "64",
            "68"
        ],
        answer: "64"
    },
    {
        question: "¿Cuál es el área de un cuadrado de lado 7 cm?",
        options: [
            "14 cm²",
            "28 cm²",
            "42 cm²",
            "49 cm²"
        ],
        answer: "49 cm²"
    },
    {
        question: "¿Cuánto es 150 + 275?",
        options: [
            "425",
            "450",
            "475",
            "500"
        ],
        answer: "425"
    },
    {
        question: "¿Qué número es el cuádruple de 15?",
        options: [
            "45",
            "50",
            "55",
            "60"
        ],
        answer: "60"
    },
    {
        question: "¿Cuántos grados suman los ángulos internos de un triángulo?",
        options: [
            "90°",
            "120°",
            "180°",
            "360°"
        ],
        answer: "180°"
    },
    {
        question: "¿Cuál es la raíz cuadrada de 144?",
        options: [
            "10",
            "11",
            "12",
            "13"
        ],
        answer: "12"
    },
    {
        question: "¿Cuánto es 1/3 de 90?",
        options: [
            "20",
            "25",
            "30",
            "35"
        ],
        answer: "30"
    },
    {
        question: "¿Qué número decimal es equivalente a 3/5?",
        options: [
            "0.3",
            "0.4",
            "0.5",
            "0.6"
        ],
        answer: "0.6"
    },
    {
        question: "¿Cuál es el resultado de 23 x 3?",
        options: [
            "66",
            "69",
            "72",
            "75"
        ],
        answer: "69"
    },
    {
        question: "¿Cuántos centímetros cuadrados hay en 1 metro cuadrado?",
        options: [
            "100",
            "1,000",
            "10,000",
            "100,000"
        ],
        answer: "10,000"
    },
    {
        question: "¿Qué número sigue en la secuencia: 3, 6, 12, 24, ...?",
        options: [
            "36",
            "42",
            "48",
            "54"
        ],
        answer: "48"
    },
    {
        question: "¿Cuánto es 2.5 x 4?",
        options: [
            "8",
            "9",
            "10",
            "11"
        ],
        answer: "10"
    },
    {
        question: "¿Cuál es el perímetro de un rectángulo de base 8 cm y altura 5 cm?",
        options: [
            "20 cm",
            "22 cm",
            "24 cm",
            "26 cm"
        ],
        answer: "26 cm"
    },
    {
        question: "¿Cuánto es 33% de 300?",
        options: [
            "90",
            "99",
            "100",
            "110"
        ],
        answer: "99"
    },
    {
        question: "¿Cuál es el resultado de 14 x 9?",
        options: [
            "116",
            "120",
            "124",
            "126"
        ],
        answer: "126"
    },
    {
        question: "¿Cuántos lados tiene un octágono?",
        options: [
            "6",
            "7",
            "8",
            "9"
        ],
        answer: "8"
    },
    {
        question: "¿Cuánto es 5.6 + 3.7?",
        options: [
            "8.3",
            "9.0",
            "9.3",
            "9.6"
        ],
        answer: "9.3"
    },
    {
        question: "¿Qué fracción representa dos tercios?",
        options: [
            "1/3",
            "2/3",
            "3/3",
            "3/2"
        ],
        answer: "2/3"
    },
    {
        question: "¿Cuál es el resultado de 28 ÷ 4?",
        options: [
            "5",
            "6",
            "7",
            "8"
        ],
        answer: "7"
    },
    
     ]