import React from 'react';

const SubscriptionForm = ()=>{

    return (
      <>
        <h2 id='textcolor'>Subscreva um Tópico!</h2>
        <div class="line"></div>
          <div>
            <label id='textcolor'for="topic">Tópico</label>
            <input type="text" id="topic" />
          </div>
          <div>
            <label id='textcolor' for="message">Mensagem</label>
            <textarea id="message" name="message" rows="3" readonly></textarea>
          </div>
          <div>
            <label id='textcolor' for="status">Status</label>
            <input type="text" id="status" readonly />
          </div> <br /><br />
          <div>
            <div class="btn-container">
              <button type="button" id="subscribe">Subscrever</button>
              <button type="button" id="unsubscribe">Remover Sub</button>
            </div>
          </div>
      </>
      
    )
}

export default SubscriptionForm