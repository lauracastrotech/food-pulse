import React from 'react'

import "../styles/LearnAboutProject.css"

export default function LearnAboutProject() {

    const techStack = ["React","Node.js","MySQL","Express","Luxon","TypeScript"]

  return (
    <div id='aboutProject'>

        <h2>The Foodpulse Project</h2>

        <div id='aboutLayout'>

            <div id='aboutLeft'>
                <a href='https://github.com/OrlaneB/food-tracker-fullstack' target='_blank' id='gitHubLink'>
                    <p>See the GitHub repository here</p>
                    <button className='roundButton'><i className='fi fi-brands-github'></i></button>
                </a>

                <p id='introduction'>The inspiration for Food Pulse came from one of the app developers Laura Castro.<br/> Her friend's daughter had been diagnosed with anemia. This sparked a deep dive into iron deficiency, during which she came across an article discussing how pairing certain foods can maximize nutrient absorption. And voila! She brought the idea to her classmate, Orlane Brun, who enthusiastically joined her in creating this helpful tool. <br/><br/>

                Together, we developed Food Pulse to provide personalized insights into nutrient intake. Through collaboration and careful planning, we designed an application to meet diverse dietary needs while making nutrition tracking accessible and user-friendly</p>

                <p>Try for free!</p>

                <div id='techStack'>
                    <h3>Tech stack</h3>
                    <ul>
                        {techStack.map((item,index)=>(
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div id='aboutRight'>
                <h3>The contributors</h3>
                <div id='contributors'>
                    <div>
                        <img src='profilePictureLauraCastro.png'/>
                        <h4>Laura Castro</h4>
                        <p>lauracastrotech@gmail.com</p>
                        <a href='https://github.com/lauracastrotech' target="_blank">
                            <button className='roundButton'>
                                <i className="fi fi-brands-github"></i>
                            </button>
                        </a>
                        <a href='https://www.linkedin.com/in/loudtech/' target='_blank'>
                            <button className='roundButton'>
                                <i className="fi fi-brands-linkedin"></i>
                            </button>
                        </a>
                    </div>

                    <div>
                        <img src='profilePictureOrlaneBrun.jpg'/>
                        <h4>Orlane Brun</h4>
                        <p>orlane.brun@free.fr</p>
                        <a href='https://github.com/OrlaneB' target="_blank">
                            <button className='roundButton'>
                                <i className="fi fi-brands-github"></i>
                            </button>
                        </a>
                        <a href='https://www.linkedin.com/in/orlane-brun/' target='_blank'>
                            <button className='roundButton'>
                                <i className="fi fi-brands-linkedin"></i>
                            </button>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}
