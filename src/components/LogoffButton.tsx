const LogoffButton = () => {
    const handleLogoff = () => {
      const logoff = {
        logoff: "True"
      }
        window.Telegram.WebApp.sendData(JSON.stringify(logoff));
    };

    return (
        <button onClick={handleLogoff} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Logoff
        </button>
    );
};

export default LogoffButton;
