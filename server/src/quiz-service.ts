import { db, auth, adminAuth } from './firebase'

class QuizService {
  getUserInfoById(id: string) {
    return db
      .collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
            return doc.data();
        } else {
            throw Error("No such document!")
        }
      }).catch((error) => {
          return error
      });
  };
  
  
  addUser(user: any) {
    const username = user.email.split('@')[0]; // Taking email name as username
    const timestamp = new Date().toUTCString();

    const data = {
      name: username,
      created: timestamp,
      quizes: {}
    };

    return db
      .collection("users")
      .doc(user.uid)
      .set(data)
    }
    

    async changeUserName(userName:string, token: {i: string}) {
      try {
        const isAllowed = await adminAuth.verifyIdToken(token.i)
        if(isAllowed.uid) {
          return db.collection("users").doc(isAllowed.uid).update({"name": userName});
        } else {
          throw Error("Not allowed")
        }
      } catch (error) {
        throw Error(error.message)
      }
     
    }
}

const quizService = new QuizService();
export default quizService;
