""" Vehicles Routing Problem (VRP)."""
from __future__ import print_function
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from flask import jsonify, Flask, make_response,request, render_template
from flask_restful import Resource, Api
from flask_cors import CORS
import json
"""
[
        [0, 24392, 33384, 14963, 31992, 32054, 20866, 28427, 15278, 21439, 28765, 34618, 35177, 10612, 26762, 27278],
        [25244, 0, 8314, 10784, 6922, 6984, 10678, 3270, 10707, 7873, 11350, 9548, 10107, 19176, 12139, 13609],
        [34062, 8491, 0, 14086, 4086, 1363, 11008, 4239, 13802, 9627, 7179, 1744, 925, 27994, 9730, 10531],
        [15494, 13289, 13938, 0, 11065, 12608, 4046, 10970, 581, 5226, 10788, 15500, 16059, 5797, 9180, 9450],
        [33351, 7780, 4096, 11348, 0, 2765, 7364, 4464, 11064, 6736, 3619, 4927, 5485, 20823, 6170, 7076],
        [32731, 7160, 1363, 12755, 2755, 0, 9677, 3703, 12471, 8297, 7265, 2279, 2096, 26664, 9816, 9554],
        [19636, 10678, 11017, 4038, 7398, 9687, 0, 9159, 3754, 2809, 7099, 10740, 11253, 8970, 5491, 5928],
        [29097, 3270, 4257, 11458, 4350, 3711, 9159, 0, 11174, 6354, 10160, 5178, 5258, 23029, 10620, 12419],
        [15809, 10707, 13654, 581, 10781, 12324, 3763, 10687, 0, 4943, 10504, 15216, 15775, 5216, 8896, 9166],
        [21831, 7873, 9406, 5226, 6282, 8075, 2809, 6354, 4943, 0, 6967, 10968, 11526, 10159, 5119, 6383],
        [28822, 11931, 6831, 11802, 3305, 6043, 7167, 10627, 11518, 7159, 0, 5361, 6422, 18351, 3267, 4068],
        [35116, 9545, 1771, 15206, 4648, 2518, 10967, 5382, 14922, 10747, 5909, 0, 1342, 29094, 8460, 9260],
        [36058, 10487, 927, 16148, 5590, 2211, 11420, 9183, 15864, 11689, 6734, 1392, 0, 30036, 9285, 10086],
        [11388, 19845, 28838, 5797, 20972, 27507, 8979, 23880, 5216, 10159, 18622, 29331, 29890, 0, 16618, 17135],
        [27151, 11444, 9719, 10131, 6193, 8945, 5913, 10421, 9847, 5374, 3335, 8249, 9309, 16680, 0, 1264],
        [27191, 14469, 10310, 9394, 7093, 9772, 5879, 13164, 9110, 6422, 3933, 8840, 9901, 16720, 1288, 0]
    ]
"""
app = Flask(__name__)
CORS(app)
api = Api(app)
get_vehicle= 0

def create_data_model():
    """Stores the data for the problem."""
    data = {}
    data['distance_matrix'] = [
        [
            0, 548, 776, 696
        ],
        [
            548, 0, 684, 308
        ],
        [
            776, 684, 0, 992
        ],
        [
            696, 308, 992, 0
        ]
    ]
    # data['num_vehicles'] = 1
    data['num_vehicles'] = 1
    data['depot'] = 0
    return data


def print_solution(data, manager, routing, solution):
    global global_sol
    global jsonData
    global_sol = []
    """Prints solution on console."""
    max_route_distance = 0
    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        # plan_output = 'Route for vehicle {}:\n'.format(vehicle_id)
        plan_output = ''
        route_distance = 0
        while not routing.IsEnd(index):
            jsonData = '{}'
            jsonDataParsed = json.loads(jsonData)
            plan_output += ' {} -> '.format(manager.IndexToNode(index))
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id)
        plan_output += '{}\n'.format(manager.IndexToNode(index))
        plan_output += 'Distance of the route: {}m\n'.format(route_distance)
        print(plan_output)
        max_route_distance = max(route_distance, max_route_distance)
        sol_dict = {"route" : str(plan_output)}
        # print(sol_dict)
        jsonDataParsed.update(sol_dict)  
        # jsonData = json.dumps(jsonDataParsed)        
        global_sol.append(jsonDataParsed)
        print("JSON data")
        print(jsonDataParsed)
        print("global array")
        print(global_sol)   
    print('Maximum of the route distances: {}m'.format(max_route_distance))




def main():
    """Solve the CVRP problem."""
    # Instantiate the data problem.
    data = create_data_model()
    # Create the routing index manager.
    manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                           data['num_vehicles'], data['depot'])

    # Create Routing Model.
    routing = pywrapcp.RoutingModel(manager)


    # Create and register a transit callback.
    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data['distance_matrix'][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of each arc.
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add Distance constraint.
    dimension_name = 'Distance'
    routing.AddDimension(
        transit_callback_index,
        0,  # no slack
        3000,  # vehicle maximum travel distance
        True,  # start cumul to zero
        dimension_name)
    distance_dimension = routing.GetDimensionOrDie(dimension_name)
    distance_dimension.SetGlobalSpanCostCoefficient(100)

    # Setting first solution heuristic.
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

    # Solve the problem.
    solution = routing.SolveWithParameters(search_parameters)

    # Print solution on console.
    if solution:
        print_solution(data, manager, routing, solution)


@app.route("/", methods=['POST', 'GET'])
def get():
        # print(data)
        # sti = '\''+global_sol+'\''
        # sti = str(global_sol)
        # sti = '[{"$class":"org.coldblocks.mynetwork.TransitPackage","packageID":"H001","location":"Govt. Engineering College, Thrissur, Viyyur - Thanikkudam Road, Thrissur, Thanikkudam - 680009, Kerala, India","temperature":"32","destination":"RSET","holder":"S01","status":"0"},{"$class":"org.coldblocks.mynetwork.TransitPackage","packageID":"H002","location":"undefined","temperature":"undefined","destination":"RSET","holder":"S01","status":"1"}]'
        ar = jsonify(global_sol)
        return (ar)

@app.route("/getVehicleData", methods=['POST'])
def post():
    text_input = request.form["vehicleNo"]
    with open('data.txt', 'w') as data_file:
            data_file.write(text_input)
    # return jsonify({'message': 'Data saved sucessfully!'}), 200
    text_input = None
    with open('data.txt', 'r') as data_file:
            text_input = data_file.read()
    # print(text_input)
    main()
    return make_response("hey")


global_sol = []


if __name__ == '__main__':
    app.run(debug= True)
    
    