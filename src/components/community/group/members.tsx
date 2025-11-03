import { motion } from "framer-motion";

const GroupMembers = ({
  members,
}: {
  members: { name: string; picture: string; _id: string }[];
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const memberVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 0.6,
      },
    },
  };

  return (
    <div className="max-w-7xl p-6 mx-auto mt-10">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 place-items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {members.map((member, index) => (
          <motion.div
            key={index}
            variants={memberVariants}
            whileHover={{
              y: -10,
              transition: { type: "spring", stiffness: 300, damping: 15 },
            }}
            className="group cursor-pointer"
          >
            <div className="space-y-3 text-center">
              {/* Profile Picture Container */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-orange-400 to-yellow-400 overflow-hidden mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    src={member.picture}
                    alt={`${member.name} profile`}
                    onError={(e) => {
                      (
                        e.target as HTMLImageElement
                      ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=f97316&color=ffffff&size=200&font-size=0.6`;
                    }}
                  />
                </div>

                <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 p-1 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                  <div className="w-full h-full rounded-full bg-white"></div>
                </div>

                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
              </div>

              <div className="space-y-1">
                <h1 className="font-bold text-lg tracking-wider text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                  {member.name}
                </h1>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GroupMembers;
