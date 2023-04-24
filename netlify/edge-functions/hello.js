export default async (request, context) => {




    return new Response(JSON.stringify({"greeting":"Hello botch"}), {
        header:{
            "context-type":"application/json",
        },
    });
};