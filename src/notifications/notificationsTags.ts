import OneSignal from "react-native-onesignal";

interface TagUserIngfoCreateProps {
    name: string, 
    email: string
}

export function tagUserInfoCreate({ email, name }: TagUserIngfoCreateProps) {
    OneSignal.sendTags({
        'user_name': name,
        'user_email': email
    })
}


export function tagUserInfoDelete() {
    OneSignal.deleteTags(['user_name', 'user_email'])
}

export function tagLastExerciseUpdate(exercise: string) {
    OneSignal.sendTag('last_completed_exercise', exercise)
}

//recebe a quantidade de exercícios realizados no dia, toda vez que um exercício é realizado no mesmo dia é realizado um novo apdate nessa tag
export function tagAmountOfExercisesUpdate(exercisesCount: string) {
    OneSignal.sendTag('exercises_count' , exercisesCount)
} 