import privateClient from "../clients/private.client"

const taskEndpoints={
    fetch:'tasks/fetch',
    create:'tasks/create',
    update:'tasks/update'
}


const taskApi={
    create:async({title,description,priority,type,level,estimatedHours,parentTaskId,assignedTo})=>{
        try {
            const res=await privateClient.post(
                taskEndpoints.create,
                {title,description,priority,type,level,estimatedHours,parentTaskId,assignedTo}
            )
            return {res}
        } catch (error) {
            return {error}
        }
    },
    fetch:async()=>{
        try {
            const res=await privateClient.get(
                taskEndpoints.fetch,
            )
            return {res}
        } catch (error) {
            return {error}
        }
    }
}

export default taskApi;