const { default: axios } = require("axios")

async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇

  const footer = document.querySelector('footer')
  const currentYear = new Date().getFullYear()
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`

  async function fetchData() {
    try {
      const [learnersResponse, mentorsResponse] = await Promise.all([
        axios.get('http://localhost:3003/api/learners'),
        axios.get('http://localhost:3003/api/mentors')
      ])

      return combineData(learnersResponse.data, mentorsResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  function combineData(learners, mentors) {
    return learners.map(learner => {
      const mentorNames = learner.mentors.map(id => {
        const mentor = mentors.find(m => m.id === id)
        return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'Unknown Mentor'
      })
      return {...learner, mentors: mentorNames}
    })
  }
  

  function createLearnerCard(learner) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${learner.fullName}</h3>
      <p>Email: ${learner.email}</p>
      <div class="mentor-list">
        <h4 class="mentor-toggle closed">Mentors</h4>
        <ul style="display: none;">
          ${learner.mentors.map(name => `<li>${name}</li>`).join('')}
        </ul>
      </div>
    `

    const mentorToggle = card.querySelector('.mentor-toggle')
    const mentorList = card.querySelector('ul')
    const nameElement = card.querySelector('h3')

    mentorToggle.addEventListener('click', function(event) {
      event.stopPropagation()
      this.classList.toggle('closed')
      this.classList.toggle('open')
      mentorList.style.display = mentorList.style.display === 'none' ? 'block' : 'none'
    })

    card.addEventListener('click', function() {
      const isSelected = this.classList.contains('selected');
      document.querySelectorAll('.card.selected').forEach(selectedCard => {
          selectedCard.classList.remove('selected');
          selectedCard.querySelector('h3').textContent = selectedCard.querySelector('h3').textContent.replace(/, ID \d+/, '');
      });

      if (!isSelected) {
          this.classList.add('selected');
          nameElement.textContent = `${learner.fullName}, ID ${learner.id}`;
      } else {
          this.classList.remove('selected');
          nameElement.textContent = learner.fullName;
      }

      const infoParagraph = document.querySelector('.info');
      if (this.classList.contains('selected')) {
          infoParagraph.textContent = `The selected learner is ${learner.fullName}`;
      } else {
          infoParagraph.textContent = 'No learner is selected';
      }
  });

  return card;
}

function renderLearnerCards(data) {
  const cardsContainer = document.querySelector('.cards');
  data.forEach(learner => {
      const card = createLearnerCard(learner);
      cardsContainer.appendChild(card);
  });

  const infoParagraph = document.querySelector('.info');
  infoParagraph.textContent = 'No learner is selected';
}

const combinedData = await fetchData();
if (combinedData) {
  renderLearnerCards(combinedData);
}


  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
