import { useRef, useEffect, useState } from "react"

export default function DataList({ name, data, onSelect=()=>{} }) {
  const [inputText, setInputText] = useState('');

  const input = useRef()
  const datalist = useRef()
  const userInput = useRef()

  useEffect(() => {
    input.current.onfocus = function() {
      datalist.current.style.display = 'block';
      input.current.style.borderRadius = "10px 10px 0 0";
    };

    const close = function() {
      datalist.current.style.display = 'none';
      input.current.style.borderRadius = "10px";
    }
    
    for (let option of datalist.current.options) {
      option.onclick = function() {
        setInputText(option.value);
        close()
      };
    };
    document.body.onclick = function(e) {
      if(datalist.current && input.current && !e.target.closest('option') && !e.target.closest('input'))
        close()
    };

    var currentFocus = -1;
    input.current.onkeydown = function(e) {
      if (e.keyCode == 40) {
        currentFocus++
        addActive(datalist.current.options);
      }
      else if (e.keyCode == 38) {
        currentFocus--
        addActive(datalist.current.options);
      }
      else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (datalist.current.options) datalist.current.options[currentFocus].click();
        }
      }
    }
  
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
      }
    }
  }, [])

  useEffect(() => {
      var text = inputText.toUpperCase();
      if(!text || text === '') {
        userInput.current.style.display = "none";
      }
      else {
        userInput.current.style.display = "block";
      }
      for (let option of datalist.current.options) {
        if (!option.classList.contains('userInput')) {
          if (option.value.toUpperCase().indexOf(text) > -1) {
            option.style.display = "block";
          } else {
            option.style.display = "none";
          }
          if(option.value.toUpperCase() === text) {
            userInput.current.style.display = "none";
          }
        }
      };
      onSelect(inputText)
  }, [inputText])

  return <div className="DataList textfield">
    <input autoComplete="off" placeholder=" " type="text" list="" onInput={(e) => {setInputText(e.target.value)}} value={inputText} ref={input} />
    <label>{name}</label>
    <datalist ref={datalist}>
      <option ref={userInput} className="userInput">{inputText}</option>
      {data.map((item) => {
        return <option>{item.name}</option>
      })}
    </datalist>
  </div>
}