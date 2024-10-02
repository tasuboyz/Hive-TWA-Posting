import './Form css/LogoffButton.css';

const LogoffButton = () => {
  const handleLogoff = () => {
    const logoff = {
      logoff: "True"
    }
    window.Telegram.WebApp.sendData(JSON.stringify(logoff));
  };

  return (  
    <button onClick={handleLogoff} className="button-logoff">
      Logoff
    </button>
  );
};

export default LogoffButton;
