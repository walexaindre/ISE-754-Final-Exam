<script lang="ts">
</script>

<div>
    <table class="table table-md border-2 border-base-content/5 mb-4">
        <thead>
            <tr>
                <th colspan="3" class="font-bold text-lg text-primary">
                    a. Model as an optimization problem</th
                >
            </tr>
            <tr>
                <th> Part </th>
                <th class="w-80"> Description </th>
                <th class="w-120"> Reason </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td> Objective Function</td>
                <td>
                    Maximize the total reward collected from visited nodes
                    substracting the total travel distance.
                </td>
                <td>
                    There are no other parameters in our problem besides the
                    limitations of visiting the nodes once and the incentive of
                    collecting the prize. <br /><br /> I consider that some multiplier
                    should be given to the prizes or the distances to make them comparable.
                    If the distances are too big, there is no benefit in moving and
                    since I'm not forced to visit all nodes, I can just stay at the
                    most beneficial
                </td>
            </tr>
            <tr>
                <td>Constraint 1</td>
                <td> Subtour elimination</td>
                <td>
                    Since this is a TSP variant, the subtours aren't allowed.
                </td>
            </tr>

            <tr>
                <td>Constraint 2</td>
                <td>
                    Each node can be visited at most once with the exception of
                    the starting point</td
                >
                <td>
                    TSP requieres this constraint and it makes sense since you
                    shouldn't be able to collect the prize multiple times. If
                    you allow that, looping through a pair of close nodes con
                    make our objective infinite.
                </td>
            </tr>

            <tr>
                <td> Constraint 3</td>
                <td> The starting and exit point should be the same</td>
                <td> TSP forces this condition </td>
            </tr>
            <tr>
                <td> Constraint 4</td>
                <td> The prize can be collected only once</td>
                <td></td>
            </tr>

            <tr>
                <td> Variables 1</td>
                <td>
                    Binary variable that indicates if a node was visited or not
                </td>
                <td> </td>
            </tr>

            <tr>
                <td> Variable 2</td>
                <td> Starting node </td>
                <td>
                    I consider the starting node as free parameter that we can
                    optimize.
                </td>
            </tr>
        </tbody>
    </table>

    <p>
        The model must represent how profitable is to walk an arc between two
        nodes and help you to select the most convinient one
    </p>

    <table class="table table-md border-2 border-base-content/5 mt-4">
        <thead>
            <tr>
                <th colspan="3" class="font-bold text-lg text-primary">
                    b. Heuristic for the prize collecting TSP</th
                >
            </tr>
            <tr>
                <th> Step </th>
                <th> Description </th>
                <th> Go to</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>
                    Since the starting point is not given, search for the most
                    promising node <span class="font-bold"
                        >(node with the highest reward)</span
                    >
                </td>
                <td></td>
            </tr>
            <tr>
                <td>2</td>
                <td
                    >Calculate the delta between the minimum distance between
                    two arcs and the prize. After this, pick the most profitable
                    one.</td
                >
                <td></td>
            </tr>

            <tr>
                <td>3</td>
                <td
                    >If there is no profitable one, look one step ahead and if
                    no profits are posible, pick a path with minimal loses to
                    the depot.
                </td>
                <td></td>
            </tr>
            <tr>
                <td>4</td>
                <td>
                    Repeat until no more nodes are left or no more profitable
                    paths are available.
                </td>
                <td>2</td>
            </tr>
        </tbody>
    </table>
</div>
<p class="my-4">
    This heuristic is based on the greedy idea of move towards profitable arcs
    and return to the depot at the first sign of loses.
</p>
