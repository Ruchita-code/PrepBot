import React, { useEffect, useRef, useState } from 'react'
import maleVideo from "../assets/Videos/male-aii.mp4"
import femaleVideo from "../assets/Videos/female-aii.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import { PiMicrophoneLight } from "react-icons/pi";
import { PiMicrophoneSlash } from "react-icons/pi";
import axios from 'axios'
import { ServerUrl } from '../App'
import { RiQuestionLine } from 'react-icons/ri'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender ] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);
  const CurrentQuestion = questions[currentIndex];

  useEffect(() =>{
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if(!voices.length) return;

      //Try known female voices first
      const femaleVoice = 
      voices.find(v => 
        v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );
      if(femaleVoice){
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }
      //Try known male voices
      const maleVoice = 
      voices.find(v => 
        v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male") 
        );
      if(maleVoice){
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback : first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  },[])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  //  --------------------SPEAK FUNCTION-------------------------
  const speakText = (text) => {
    return new Promise((resolve) => {
      if(!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods 
      const humanText = text
      .replace(/,/g, ", ...")
      .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      //Human-like pacing
      utterance.rate = 0.92;   //slightly slower than normal
      utterance.pitch = 1.05;   // small warmth 
      utterance.volume = 1;

      utterance.onstart =() => {
        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
        
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  }; 

  useEffect(() =>{
    if(!selectedVoice){
      return; 
    }
    const runIntro= async () => {
      if(isIntroPhase){
        await speakText(
          `Hello ${userName}, thanks for joining us today. I hope you’re doing well.`
        );

        await speakText(
          "I’m your AI interviewer. I’ll be guiding you through a few questions to understand your skills and experience. "
        );

        setIsIntroPhase(false)
      }else if(CurrentQuestion){

        //if last question (hard level)
        if(currentIndex === questions.length-1){
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(CurrentQuestion.question);

        if(isMicOn) {
          startMic();
        }
      }
    }
    runIntro()

  },[selectedVoice, isIntroPhase, currentIndex])


  useEffect (() =>{
    if(isIntroPhase) return;
    if(!CurrentQuestion) return;

    const timer = setInterval(()=>{
      setTimeLeft((prev)=>{
        if(prev<= 1){
          clearInterval(timer)
          return 0;
        }
        return prev - 1 
      })
  }, 1000);

  return () => clearInterval(timer)

  }, [isIntroPhase, currentIndex ])

  useEffect(() => {
    if(!isIntroPhase && CurrentQuestion) {
      setTimeLeft(CurrentQuestion.timeLimit || 60 );
    }
  }, [currentIndex])

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = 
      event.results[event.results.length - 1][0].transcript;

    setAnswer((prev) => prev + " " + transcript);

    };

    recognitionRef.current = recognition;

  }, [])

  const startMic = () => {
    if(recognitionRef.current && !isAIPlaying){
      try{
        recognitionRef.current.start();
      }catch{

      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    }else{
      startMic();
    }
    setIsMicOn(!isMicOn);
  };
  
  const submitAnswer = async () => {
    if(isSubmitting) return;
    stopMic()
    setIsSubmitting(true)

    try{
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer",{
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
        CurrentQuestion.timeLimit - timeLeft,
      }, {withCredentials:true}) 

      setFeedback(result.data.feedback)
      speakText(result.data.feedback)
      setIsSubmitting(false)
    }catch(error){ 
      console.log(error)
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
      setAnswer("");
      setFeedback("");

      if(currentIndex +1 >= questions.length) {
        finishInterview ();
        return;
      }

      await speakText("Alright, let's move to the next Question.");

      setCurrentIndex(currentIndex + 1);
      setTimeout(() => {
        if (isMicOn) startMic();
      }, 500); 

    }

    const finishInterview = async () => {
      stopMic()
      setIsMicOn(false)
      try {
        const result = await axios.post(ServerUrl + "/api/interview/finish", {
          interviewId}, {withCredentials:true})

          console.log(result.data)
          onFinish(result.data)
      } catch (error) {
        console.log(error)
        
      }
  }

  useEffect(() => {
    if (isIntroPhase) return;
    if (CurrentQuestion) return;

    if(timeLeft === 0 && !isSubmitting && !feedback){
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if(recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  },[]);

  return (
    <div className='min-h-screen bg-linear-to-br from-purple-50 via-white to-violet-200 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* Video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video 
          src={videoSource}
          key={videoSource}
          ref={videoRef}
          muted playsInline 
          preload='auto'
          className='w-full h-auto object-cover'
           />
          </div>

          {/* subtitle */}

          {subtitle && ( 
            <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm'> 
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p> 
            </div>
          )}

          {/* timer area */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>Interview Status</span>
              {isAIPlaying && <span className='text-sm font-semibold text-fuchsia-600 '>{isAIPlaying ? "AI Speaking" : ""}
                </span>} 
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='flex justify-center'>

              <Timer timeLeft={timeLeft} totalTime={CurrentQuestion?.timeLimit} />  
            </div>

            <div className='h-px bg-gray-200'></div> 
            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-fuchsia-600'>
                  { currentIndex +1 } 
                </span>
                <span className='text-xs text-gray-400'>Current Questions</span>
              </div>
              <div>
                <span className='text-2xl font-bold text-fuchsia-600'>{questions.length}</span>
                <span className='text-xs text-gray-400'>Total Questions</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Text section */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-fuchsia-800 mb-6'>
            AI Smart Interview
          </h2>

          {!isIntroPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='text-xs sm:text-sm text-gray-400 mb-2'>
              Question { currentIndex +1 } of {questions.length} 
            </p>

            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relative'>{CurrentQuestion?.question}</div>
          </div>)
          }

            {/* Text Area  */}
            <textarea 
            placeholder='Type your answer here...'
            onChange={(e)=> setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 transition text-gray-800"/> 

            {!feedback ? (<div className='flex items-center gap-4 mt-6'>
              <motion.button 
              onClick={toggleMic}
              whileTap={{scale:0.9}}
              className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'> 
              {isMicOn ? <PiMicrophoneLight size={20}/> : <PiMicrophoneSlash size={20}/>}
              </motion.button>

              <motion.button
              onClick={submitAnswer}
              disabled={ isSubmitting }
              whileTap={{scale:0.95}}

                className='flex-1 bg-[#7e4b89] text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:opacity-50'>

                {isSubmitting?"Submit Answer...":"Submit Answer"}

                
              </motion.button>
            </div>): (
              <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
              //   <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>
              //   <button 
              //   onClick={handleNext}
              //   className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'>
              //     Next Question <BsArrowRight size={18}/>
              //   </button>
              // className='mt-6 bg-violet-50 border border-violet-200 p-5 rounded-2xl shadow-sm'>
              //   <p className='text-violet-700 font-medium mb-4'>{feedback}</p>
              //   <button 
              //   onClick={handleNext}
              //   className='w-full text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'
              //   style={{background: 'linear-gradient(to right, #6d28d9, #a78bfa)'}}>
              //     Next Question <BsArrowRight size={18}/>
                // </button>
                className='mt-6 bg-purple-50 border border-purple-200 p-5 rounded-2xl shadow-sm'>
                <p className='text-fuchsia-800 font-medium mb-4'>{feedback}</p>
                <button 
                onClick={handleNext}
                className='w-full text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'
                style={{background: 'linear-gradient(to right, #7e4b89, #9b6ba8)'}}>
                  Next Question <BsArrowRight size={18}/>
                </button>

              </motion.div>

            )}
        </div>

      </div>
    </div>
  )
}

export default Step2Interview 
