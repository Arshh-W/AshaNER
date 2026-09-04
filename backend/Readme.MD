# database
    so the database is done and the auth too 
    till now 3 tables are there 
    - users (for user email, password and id)
    - patients (for patients details)
    - game sessions (to store the game results and track the growth)

    schemas are done with pydantic which handles the database

# offline pipeline sync
    if user plays offline or with the unstable internet connection, frontend will right all the logs in the local storage of the users and when the internet will be back then the frontend will send that array to sync it with backend

    and in the backend :
    - deduplication check -> if id already exists in the database so that the no duplicate records will be there if the user sync twice
    - batch storage -> will insert all unsynced data in the single table that will be game_sessions
    - background trigger -> sends synced sessions to backeground tasks to evaluate cognitive drops or to send alerts to caregiver

